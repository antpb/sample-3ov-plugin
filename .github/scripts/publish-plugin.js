const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = 'https://cfdb.sxpdigital.workers.dev';
const PLUGIN_NAME = process.env.PLUGIN_NAME;
const ZIP_FILE = path.resolve(process.env.ZIP_FILE);
const JSON_FILE = path.resolve(process.env.JSON_FILE);
const ASSETS_DIR = path.resolve(process.env.ASSETS_DIR);
const AUTHOR_INFO = path.resolve(process.env.AUTHOR_INFO);

async function login() {
  try {
    const response = await axios.post(`${API_URL}/login`, { 
      email: process.env.EMAIL, // Replace with actual email or use environment variable
      password: process.env.PASSWORD, // Replace with actual password or use environment variable
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function uploadFile(url, data, token) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    if (!response.data.success) {
      throw new Error(`Upload failed: ${response.data.error || 'Unknown error'}`);
    }
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
}

async function uploadZipInChunks(zipPath, token) {
  const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  const zipContent = fs.readFileSync(zipPath);
  const totalChunks = Math.ceil(zipContent.length / CHUNK_SIZE);

  for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
    const start = (chunkNumber - 1) * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, zipContent.length);
    const chunk = zipContent.slice(start, end);
    const base64Chunk = chunk.toString('base64');

    await uploadFile(`${API_URL}/plugin-upload-chunk`, {
      pluginName: PLUGIN_NAME,
      fileData: base64Chunk,
      chunkNumber,
      totalChunks,
      isJson: false
    }, token);

    console.log(`Uploaded chunk ${chunkNumber}/${totalChunks}`);
  }
}

async function uploadAssets(assetsDir, token) {
  const assetFiles = ['banner-1500x620.jpg', 'icon-256x256.jpg'];
  const uploadedAssets = [];

  for (const assetFile of assetFiles) {
    const filePath = path.join(assetsDir, assetFile);
    if (!fs.existsSync(filePath)) {
      console.warn(`Asset file not found: ${filePath}`);
      continue;
    }

    const fileContent = fs.readFileSync(filePath);
    const base64Content = fileContent.toString('base64');

    const response = await uploadFile(`${API_URL}/plugin-upload-assets`, {
      pluginName: PLUGIN_NAME,
      fileName: assetFile,
      fileData: base64Content,
    }, token);

    uploadedAssets.push(response.assetUrl);
    console.log(`Uploaded asset: ${assetFile}`);
  }

  return uploadedAssets;
}

async function main() {
  try {
    const token = await login();

    // Upload ZIP file
    await uploadZipInChunks(ZIP_FILE, token);
    console.log('ZIP file uploaded successfully');

    // Upload JSON file
    const jsonContent = fs.readFileSync(JSON_FILE, 'utf8');
    await uploadFile(`${API_URL}/plugin-upload-json`, {
      pluginName: PLUGIN_NAME,
      jsonData: jsonContent,
    }, token);
    console.log('JSON file uploaded successfully');

    // Update author info
    const authorData = JSON.parse(fs.readFileSync(AUTHOR_INFO, 'utf8'));
    await uploadFile(`${API_URL}/update-author-info`, {
      pluginName: PLUGIN_NAME,
      authorData,
    }, token);
    console.log('Author info updated successfully');

    // Upload assets
    const uploadedAssets = await uploadAssets(ASSETS_DIR, token);
    console.log('Assets uploaded successfully');

    // Finalize upload
    const metadata = JSON.parse(jsonContent);
    const finalizeResponse = await uploadFile(`${API_URL}/plugin-upload-complete`, {
      pluginName: PLUGIN_NAME,
      zipFileSize: fs.statSync(ZIP_FILE).size,
      metadata,
    }, token);

    console.log('Plugin upload completed successfully');
    console.log('ZIP URL:', finalizeResponse.zipUrl);
    console.log('Metadata URL:', finalizeResponse.metadataUrl);
    console.log('Assets URLs:', uploadedAssets);
  } catch (error) {
    console.error('Plugin upload failed:', error);
    process.exit(1);
  }
}

main();