import { __ } from "@wordpress/i18n";
import React, { useState } from 'react';
import { DropZone } from '@wordpress/components';
import './editor.scss';
import {
	useBlockProps,
	ColorPalette,
	InspectorControls,
	MediaUpload
} from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import { more } from '@wordpress/icons';

import ThreeObjectEdit from './ThreeObjectEdit';

export default function Edit({ attributes, setAttributes, isSelected }) {

	const onChangeBGColor = ( hexColor ) => {
		setAttributes( { bg_color: hexColor } );
	};
	const onImageSelect = (imageObject) => {
		setAttributes({ threeObjectUrl: null })
		setAttributes({ threeObjectUrl: imageObject.url })
	};
	const onChangeZoom = (zoomValue) => {
		setAttributes({ zoom: zoomValue })
	};

	const onChangePositionY = (posy) => {
		setAttributes({ positionY: posy })
	};

	const onChangeScale = (scale) => {
		setAttributes({ scale: scale })
	};

	const onChangerotationY = (rotz) => {
		setAttributes({ rotationY: rotz })
	};

	const onChangeZoomSetting = (zoomSetting) => {
		setAttributes({hasZoom: zoomSetting})
	}

	const onChangeTipSetting = (tipSetting) => {
		setAttributes({hasTip: tipSetting})
	}

	const setDeviceTarget = (target) => {
		setAttributes({deviceTarget: target})
	}

	const { mediaUpload } = wp.editor;

	const ALLOWED_MEDIA_TYPES = [ 'model/gltf-binary',  'application/octet-stream' ];

	const MyDropZone = () => {
		const [ hasDropped, setHasDropped ] = useState( false );
	 
		return (
			<div>
				{ hasDropped ? 'Dropped!' : 'Drop a glb here or' }
				<DropZone
					onFilesDrop={( files ) => mediaUpload( {
						allowedTypes: ALLOWED_MEDIA_TYPES,
						filesList: files,
						onFileChange: ( [ images ] ) => {
							onImageSelect(images);
						}
					} )}
				/>
			</div>
		);
	}

	return (
		<div {...useBlockProps()}>
			<InspectorControls key="setting">
				<Panel header="Settings">
				<PanelBody title="GLB Object" icon={ more } initialOpen={ true }>
					<PanelRow>						
						<span>select a glb file from your media library to render an object in the canvas:</span>
					</PanelRow>
					<PanelRow>
						<MediaUpload
							onSelect={(imageObject) => onImageSelect(imageObject)}
							type="image"
							label="GLB File"
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							value={attributes.threeObjectUrl}
							render={({ open }) => (
								<button onClick={open}>
										{
											attributes.threeObjectUrl
												? 'Replace Object'
												: 'Select Object'
										}
								</button>
							)}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title="Scene Settings" icon={ more } initialOpen={ true }>
				<PanelRow>
					<span>Device Target:</span>
				</PanelRow>
				<PanelRow>
						<SelectControl
							// label="Device Target"
							value={ attributes.deviceTarget }
							options={ [
									{ label: 'VR', value: 'vr' },
									{ label: 'AR', value: 'ar' },
									{ label: '2D', value: '2d' },
							] }
							onChange={ ( target ) => setDeviceTarget( target ) }
					/>
				</PanelRow>
				<PanelRow>						
						<span>Set a background color:</span>
					</PanelRow>
					<PanelRow>
						<ColorPalette label="Background Color" onChange={ onChangeBGColor }/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Scroll Camera Zoom"
							help={
									attributes.hasZoom
											? 'Zoom Enabled.'
											: 'Zoom Disabled'
							}
							checked={ attributes.hasZoom }
							onChange={ (e) => {
									onChangeZoomSetting(e);
							} }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Tip Menu (click and drag text)"
							help={
									attributes.hasTip
											? 'Tip Enabled.'
											: 'Tip Disabled'
							}
							checked={ attributes.hasTip }
							onChange={ (e) => {
									onChangeTipSetting(e);
							} }
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl 
							label="Zoom"
							value={ attributes.zoom }
							min={ 1 }
							max={ 2000 }
							onChange={ onChangeZoom }/>
					</PanelRow>
					<PanelRow>
						<RangeControl 
							label="scale"
							value={ attributes.scale }
							min={ 0 }
							max={ 200 }
							onChange={ onChangeScale }/>
					</PanelRow>
					{/* <PanelRow> */}
						{/* <RangeControl 
							label="positionX"
							value={ attributes.positionX }
							min={ -10 }
							max={ 10 }
							step={.01}
							onChange={ onChangePositionX }/>
					</PanelRow> */}
					<PanelRow>
						<RangeControl 
							label="positionY"
							value={ attributes.positionY }
							min={ -5 }
							max={ 5 }
							step={.01}
							onChange={ onChangePositionY }/>
					</PanelRow>
					<PanelRow>
						<RangeControl 
							label="rotationY"
							value={ attributes.rotationY }
							min={ -10 }
							max={ 10 }
							step={.001}
							onChange={ onChangerotationY }/>
					</PanelRow>
				</PanelBody>
				</Panel>
			</InspectorControls>
			{isSelected ?
	  		<>
				{ attributes.threeObjectUrl ? <ThreeObjectEdit 
					url={attributes.threeObjectUrl}
					deviceTarget={attributes.deviceTarget}
					backgroundColor={attributes.bg_color} 
					zoom={attributes.zoom}
					scale={attributes.scale}
					hasZoom={attributes.hasZoom}
					hasTip={attributes.hasTip}
					positionX={attributes.positionX}
					positionY={attributes.positionY}
					rotationY={attributes.rotationY}/>
				: 
				( <div className="glb-preview-container">
				<MyDropZone/>
					
				<div>
					<span>Select a glb file to render in the canvas:</span>
				</div>
				<MediaUpload
					onSelect={(imageObject) => onImageSelect(imageObject)}
					type="image"
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					value={attributes.threeObjectUrl}
					render={({ open }) => (
						<button onClick={open}>
						{
									attributes.threeObjectUrl
											? 'Replace Object'
											: 'Select Object'
							}
						</button>
					)}
				/>
				</div>)} 
			</>
			: <>
	  		{ attributes.threeObjectUrl ? <ThreeObjectEdit 
			  url={attributes.threeObjectUrl} 
			  backgroundColor={attributes.bg_color}
				deviceTarget={attributes.deviceTarget}
			  zoom={attributes.zoom}
				scale={attributes.scale}
				hasZoom={attributes.hasZoom}
				hasTip={attributes.hasTip}
			  positionX={attributes.positionX}
			  positionY={attributes.positionY}
			  rotationY={attributes.rotationY}/>	 
			  : 
			( <div className="glb-preview-container">
				<MyDropZone/>
				<div>
					<span>Select a glb file to render in the canvas:</span>
				</div>
			<MediaUpload
				onSelect={(imageObject) => onImageSelect(imageObject)}
				type="image"
				allowedTypes={ALLOWED_MEDIA_TYPES}
				value={attributes.threeObjectUrl}
				render={({ open }) => (
					<button onClick={open}>
						Select Object
					</button>
				)}
			/>
			</div>)} 
	  		</>
			}
		</div>
	);
}
