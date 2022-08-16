import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
	OrthographicCamera,
	PerspectiveCamera,
	OrbitControls,
	useAnimations,
} from '@react-three/drei';
import { VRM, VRMUtils, VRMSchema, VRMLoaderPlugin  } from '@pixiv/three-vrm'
import { GLTFAudioEmitterExtension } from 'three-omi';

	// Geometry
function Sphere(props) {
	const texture_1 = useLoader(THREE.TextureLoader, props.url);

	return (
	<mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} >
		<sphereBufferGeometry args={[5, 200, 200]} />
		<meshStandardMaterial side={THREE.DoubleSide} map={texture_1} />
	</mesh>
	);
}

function ThreeObject( props ) {
	const [ url, set ] = useState( props.src );
	useEffect( () => {
		setTimeout( () => set( props.src ), 2000 );
	}, [] );

	return Sphere(props);
}

export default function SkyEdit( props ) {
	return (
		<>
			<Canvas
				camera={ { fov: 40, zoom: 1, position: [ 0, 0, 1 ] } }
				shadowMap
				style={ {
					margin: '0 Auto',
					height: '500px',
					width: '90%',
				} }
			>
				<ambientLight intensity={ 0.5 } />
				<directionalLight
					intensity={ 0.6 }
					position={ [ 0, 2, 2 ] }
					shadow-mapSize-width={ 2048 }
					shadow-mapSize-height={ 2048 }
					castShadow
				/>
					{ props.src && (
						<Suspense fallback={ null }>
								<ThreeObject
									url={ props.src }
								/>
						</Suspense>
					) }
				<OrbitControls enableZoom={ true } />
			</Canvas>
		</>
	);
}
