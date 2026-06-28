import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, Button } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { pdfId, pdfUrl, pdfFilename, pdfImageUrl, imageSize, imageAlt, pdfTitle, pdfCaption, showTitle, showCaption } = attributes;

	const onSelectPdf = ( media ) => {
		// Try to find the appropriate thumbnail image from the media object sizes
		let chosenImageUrl = '';
		if ( media.sizes ) {
			if ( media.sizes[ imageSize ] ) {
				chosenImageUrl = media.sizes[ imageSize ].url;
			} else if ( media.sizes.medium ) {
				chosenImageUrl = media.sizes.medium.url;
			} else if ( media.sizes.full ) {
				chosenImageUrl = media.sizes.full.url;
			}
		} else if ( media.image && media.image.src ) {
			chosenImageUrl = media.image.src;
		}

		setAttributes( {
			pdfId: media.id,
			pdfUrl: media.url,
			pdfFilename: media.filename || media.title,
			pdfImageUrl: chosenImageUrl,
			// Inline fallbacks if fields were completely blank in media library
			pdfTitle: pdfTitle || media.title || '',
			pdfCaption: pdfCaption || media.caption || '',
		} );
	};

	const blockProps = useBlockProps( {
		className: `pdf-thumbnail${ ! pdfUrl ? ' is-empty' : '' }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Visibility Settings', 'pdf-thumbnail-link' ) } initialOpen={ true }>
					<ToggleControl
						label={ __( 'Show Heading / Title', 'pdf-thumbnail-link' ) }
						checked={ showTitle }
						onChange={ ( val ) => setAttributes( { showTitle: val } ) }
					/>
					<ToggleControl
						label={ __( 'Show Caption', 'pdf-thumbnail-link' ) }
						checked={ showCaption }
						onChange={ ( val ) => setAttributes( { showCaption: val } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Thumbnail Settings', 'pdf-thumbnail-link' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Image Alt Text', 'pdf-thumbnail-link' ) }
						value={ imageAlt }
						onChange={ ( val ) => setAttributes( { imageAlt: val } ) }
					/>
					<SelectControl
						label={ __( 'Image Size', 'pdf-thumbnail-link' ) }
						value={ imageSize }
						options={ [
							{ label: __( 'Thumbnail', 'pdf-thumbnail-link' ), value: 'thumbnail' },
							{ label: __( 'Medium', 'pdf-thumbnail-link' ), value: 'medium' },
							{ label: __( 'Large', 'pdf-thumbnail-link' ), value: 'large' },
							{ label: __( 'Full', 'pdf-thumbnail-link' ), value: 'full' },
						] }
						onChange={ ( val ) => setAttributes( { imageSize: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ pdfUrl && showTitle && (
					<RichText
						tagName="h3"
						className="pdf-thumbnail-title"
						value={ pdfTitle }
						onChange={ ( val ) => setAttributes( { pdfTitle: val } ) }
						placeholder={ __( 'Write a heading...', 'pdf-thumbnail-link' ) }
					/>
				) }

				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectPdf }
						allowedTypes={ [ 'application/pdf' ] }
						value={ pdfId }
						render={ ( { open } ) => (
							<div className="pdf-editor-display" onClick={ open } style={ { cursor: 'pointer' } }>
								{ ! pdfUrl ? (
									<div className="pdf-upload-placeholder" style={ { border: '2px dashed #ccc', padding: '30px', textAlign: 'center', background: '#f9f9f9' } }>
										<Button isPrimary>{ __( 'Select or Upload PDF', 'pdf-thumbnail-link' ) }</Button>
									</div>
								) : (
									<div className="link-to-pdf">
										{ pdfImageUrl ? (
											<img src={ pdfImageUrl } alt={ imageAlt || pdfFilename } style={ { display: 'block', maxWidth: '100%', height: 'auto' } } />
										) : (
											<div className="pdf-fallback-icon" style={ { padding: '20px', background: '#eee', textAlign: 'center' } }>
												<span className="dashicons dashicons-media-document" style={ { fontSize: '40px', width: '40px', height: '40px', display: 'block', margin: '0 auto 10px' } }></span>
												<p><strong>{ pdfFilename }</strong></p>
											</div>
										)}
										<div className="pdf-actions-overlay" style={ { marginTop: '10px' } }>
											<Button isSmall isSecondary>{ __( 'Replace PDF File', 'pdf-thumbnail-link' ) }</Button>
										</div>
									</div>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>

				{ pdfUrl && showCaption && (
					<RichText
						tagName="p"
						className="pdf-thumbnail-caption wp-caption-text"
						value={ pdfCaption }
						onChange={ ( val ) => setAttributes( { pdfCaption: val } ) }
						placeholder={ __( 'Write a caption...', 'pdf-thumbnail-link' ) }
					/>
				) }
			</div>
		</>
	);
}