const { Component, render } = wp.element;

import EnvironmentCustomFront from './components/EnvironmentCustomFront';
import Networking from './components/Networking';

const threeApp = document.querySelectorAll( '.three-object-three-app-environment' );
const modelsToAdd = document.querySelectorAll( '.three-object-three-app-model-block' );
const htmlToAdd = document.querySelectorAll( '.three-object-three-app-three-html-block' );
const portalsToAdd = document.querySelectorAll( '.three-object-three-app-three-portal-block' );
const sky = document.querySelectorAll( '.three-object-three-app-sky-block' );
const imagesToAdd = document.querySelectorAll( '.three-object-three-app-image-block' );
const videosToAdd = document.querySelectorAll( '.three-object-three-app-video-block' );
console.log("AYYY SUPER CUSTOM SHIT!");
threeApp.forEach( ( threeApp ) => {
	if ( threeApp ) {
		const threeUrl = threeApp.querySelector( 'p.three-object-block-url' )
			? threeApp.querySelector( 'p.three-object-block-url' ).innerText
			: '';
		const deviceTarget = threeApp.querySelector(
			'p.three-object-block-device-target'
		)
			? threeApp.querySelector( 'p.three-object-block-device-target' )
					.innerText
			: '2D';
		const backgroundColor = threeApp.querySelector(
			'p.three-object-background-color'
		)
			? threeApp.querySelector( 'p.three-object-background-color' ).innerText
			: '#ffffff';
		const zoom = threeApp.querySelector( 'p.three-object-zoom' )
			? threeApp.querySelector( 'p.three-object-zoom' ).innerText
			: 90;
		const scale = threeApp.querySelector( 'p.three-object-scale' )
			? threeApp.querySelector( 'p.three-object-scale' ).innerText
			: 1;
		const hasZoom = threeApp.querySelector( 'p.three-object-has-zoom' )
			? threeApp.querySelector( 'p.three-object-has-zoom' ).innerText
			: false;
		const hasTip = threeApp.querySelector( 'p.three-object-has-tip' )
			? threeApp.querySelector( 'p.three-object-has-tip' ).innerText
			: true;
		const positionY = threeApp.querySelector( 'p.three-object-position-y' )
			? threeApp.querySelector( 'p.three-object-position-y' ).innerText
			: 0;
		const rotationY = threeApp.querySelector( 'p.three-object-rotation-y' )
			? threeApp.querySelector( 'p.three-object-rotation-y' ).innerText
			: 0;
		const animations = threeApp.querySelector( 'p.three-object-animations' )
			? threeApp.querySelector( 'p.three-object-animations' ).innerText
			: '';

		render(
			<>
				<div id="networking">
					<div id="session-id"></div>
					<p>Peers</p>
					<div id="peers"></div>
					<p>Messages</p>
					<div id="messages" style={{display: "none"}}></div>
					<div class="button" id="send-button">Send Button</div>
					<button class="button" id="audio-button">Connect Audio</button>
					<button class="button" id="join-button">Join Public Room</button>
					<div id="videos"></div>
				</div>
				<Networking
						postSlug={postSlug}
						userData={userData}
				/>
				<EnvironmentCustomFront
					threeUrl={ threeUrl }
					deviceTarget={ deviceTarget }
					zoom={ zoom }
					scale={ scale }
					hasTip={ hasTip }
					hasZoom={ hasZoom }
					positionY={ positionY }
					rotationY={ rotationY }
					animations={ animations }
					backgroundColor={ backgroundColor }
					userData={userData}
					postSlug={postSlug}
					modelsToAdd={ modelsToAdd }
					portalsToAdd={ portalsToAdd }
					imagesToAdd={ imagesToAdd }
					videosToAdd={ videosToAdd }
					htmlToAdd={htmlToAdd}
					sky={ sky ? sky : '' }
				/></>,
			threeApp
		);
	}
} );


