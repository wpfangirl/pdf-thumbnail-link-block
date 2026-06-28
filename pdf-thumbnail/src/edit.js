import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl, Button } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { pdfId, pdfUrl, pdfFilename, pdfImageUrl, imageSize, imageAlt, pdfTitle, pdfCaption, showTitle, showCaption, showButton } = attributes;

	const onSelectPdf = ( media ) => {
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
						checked={ showTitle ?? true } // Uses nullish coalescing to force fallback
						onChange={ ( val ) => setAttributes( { showTitle: val } ) }
					/>
					<ToggleControl
						label={ __( 'Show Caption', 'pdf-thumbnail-link' ) }
						checked={ showCaption ?? true } 
						onChange={ ( val ) => setAttributes( { showCaption: val } ) }
					/>
					<ToggleControl
						label={ __( 'Show Download Button', 'pdf-thumbnail-link' ) }
						checked={ showButton ?? false } // Force explicit boolean false if undefined
						onChange={ ( val ) => setAttributes( { showButton: val } ) }
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
							{ label: __( 'Medium Large', 'pdf-thumbnail-link' ), value: 'medium-large' },
							{ label: __( 'Large', 'pdf-thumbnail-link' ), value: 'large' },
							{ label: __( 'Full', 'pdf-thumbnail-link' ), value: 'full' },
						] }
						onChange={ ( val ) => setAttributes( { imageSize: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ onSelectPdf }
						allowedTypes={ [ 'application/pdf' ] }
						value={ pdfId }
						render={ ( { open } ) => (
							<>
								{ ! pdfUrl ? (
									<div className="pdf-upload-placeholder" onClick={ open } style={ { border: '2px dashed #ccc', padding: '30px', textAlign: 'center', background: '#f9f9f9', cursor: 'pointer' } }>
										<Button isPrimary>{ __( 'Select or Upload PDF', 'pdf-thumbnail-link' ) }</Button>
									</div>
								) : (
									<div className="pdf-editor-display">
										
										{ showTitle && (
										    <h3 className="pdf-thumbnail-title">
										        <span className="editor-link-mock" style={ { textDecoration: 'underline', color: 'inherit' } }>
										            <RichText
										                tagName="span" // Swap tagName to span so it doesn't break the parent h3 semantic nesting
										                value={ pdfTitle }
										                onChange={ ( val ) => setAttributes( { pdfTitle: val } ) }
										                placeholder={ __( 'Write a heading...', 'pdf-thumbnail-link' ) }
										            />
										        </span>
										    </h3>
										) }

										<div className="link-to-pdf" onClick={ open } style={ { cursor: 'pointer' } } title={ __( 'Click image to change file', 'pdf-thumbnail-link' ) }>
											{ pdfImageUrl ? (
												<img src={ pdfImageUrl } alt={ imageAlt || pdfFilename } style={ { display: 'block', maxWidth: '100%', height: 'auto' } } />
											) : (
												<div className="pdf-fallback-icon" style={ { padding: '20px', background: '#eee', textAlign: 'center' } }>
													<span className="dashicons dashicons-media-document" style={ { fontSize: '40px', width: '40px', height: '40px', display: 'block', margin: '0 auto 10px' } }></span>
													<p><strong>{ pdfFilename }</strong></p>
												</div>
											)}
										</div>

										{ showCaption && (
											<RichText
												tagName="p"
												className="pdf-thumbnail-caption"
												value={ pdfCaption }
												onChange={ ( val ) => setAttributes( { pdfCaption: val } ) }
												placeholder={ __( 'Write a caption...', 'pdf-thumbnail-link' ) }
											/>
										) }

										{/* Interactive Preview of the Download Button */}
										{ showButton && (
											<div className="wp-block-button" style={ { marginTop: '10px', display: 'inline-block' } }>
												<span className="wp-block-button__link style-engine-placeholder" style={ { background: '#333', color: '#fff', padding: '8px 16px', borderRadius: '4px', display: 'inline-block', fontSize: '14px' } }>
													{ __( 'Download PDF File', 'pdf-thumbnail-link' ) }
												</span>
											</div>
										) }

										<div className="pdf-actions-overlay" style={ { marginTop: '15px', borderTop: '1px dashed #eee', paddingTop: '10px' } }>
											<Button isSmall isSecondary onClick={ open }>
												{ __( 'Replace PDF File', 'pdf-thumbnail-link' ) }
											</Button>
										</div>

									</div>
								) }
							</>
						) }
					/>
				</MediaUploadCheck>
			</div>
		</>
	);
}