import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
	return (
		<div {...useBlockProps.save()}>
			<>
			<div id="xr-chess-block-container"></div>
				<div className="three-object-three-app-xr-chess-block">
					<p className="xr-chess-block-positionX">
						{attributes.positionX}
					</p>
					<p className="xr-chess-block-positionY">
						{attributes.positionY}
					</p>
					<p className="xr-chess-block-positionZ">
						{attributes.positionZ}
					</p>
					<p className="xr-chess-block-rotationX">
						{attributes.rotationX}
					</p>
					<p className="xr-chess-block-rotationY">
						{attributes.rotationY}
					</p>
					<p className="xr-chess-block-rotationZ">
						{attributes.rotationZ}
					</p>
					<p className="xr-chess-block-colorWhite">
						{attributes.colorWhite}
					</p>
					<p className="xr-chess-block-colorBlack">
						{attributes.colorBlack}
					</p>
				</div>
			</>
		</div>
	);
}
