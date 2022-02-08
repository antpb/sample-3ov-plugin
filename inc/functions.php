<?php 
/** Functions **/

/**
* Registers JavaScript and CSS for threeobjectloaderinit
* @uses "wp_enqueue_script" action
*/
function threeobjectviewer_register_threeobjectloaderinit() {
    $handle = 'threeobjectloaderinit';
    $dependencies = [];
    $version = '0.0.1';

    wp_register_script(
        $handle,
        plugins_url("/inc/$handle/index.js", __DIR__ ),
        $dependencies,
        $version
    );
    wp_register_style(
        $handle,
        plugins_url("/inc/$handle/index.css", __DIR__ ),
        [],
        $version
    );
}

/**
* Enqueue JavaScript and CSS for threeobjectloaderinit
* @uses "wp_enqueue_script" action
*/
function threeobjectviewer_enqueue_threeobjectloaderinit() {
    $handle = 'threeobjectloaderinit';
    wp_enqueue_script(
        'threeobjectloaderinit',
    );
    wp_enqueue_style(
        'threeobjectloaderinit'
    );
}

add_filter('upload_mimes', 'add_file_types_to_uploads', 1, 1);

function add_file_types_to_uploads($file_types){
  $new_filetypes = array();
  // Potentially need to restore as model/gltf-binary in the future.  
  // $new_filetypes['glb'] = 'model/gltf-binary';
  $new_filetypes['glb'] = 'application/octet-stream';
  $new_filetypes['vrm'] = 'application/octet-stream';
  $file_types = array_merge($file_types, $new_filetypes );
  return $file_types;
}

add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
  if (!$data['type']) {
      $wp_filetype = wp_check_filetype($filename, $mimes);
      $ext = $wp_filetype['ext'];
      $type = $wp_filetype['type'];
      $proper_filename = $filename;
      if ($type && 0 === strpos($type, 'model/') && $ext !== 'glb') {
          $ext = $type = false;
      }
      if ($type && 0 === strpos($type, 'model/') && $ext !== 'vrm') {
          $ext = $type = false;
      }
      $data['ext'] = $ext;
      $data['type'] = $type;
      $data['proper_filename'] = $proper_filename;
  }
  return $data;
}, 10, 4);

add_action( "wp_enqueue_scripts", __NAMESPACE__ . '\frontend_assets' );
/**
 * Enqueue block frontend JavaScript
 */
function frontend_assets(){

	$frontend_js_path = "/assets/js/blocks.frontend.js";

	wp_enqueue_script( 
		"threeobjectloader-frontend",
		plugin_dir_url( __FILE__ ) . '../build/assets/js/blocks.frontend.js',
		['wp-element'],
		'',
		true
	);
}
