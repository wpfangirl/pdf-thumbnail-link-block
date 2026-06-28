<?php
/**
 * PDF Thumbnail Block Frontend Render
 *
 * @package       WPFangirl
 * @version       1.4.0
 */

$pdf_id       = isset( $attributes['pdfId'] ) ? (int) $attributes['pdfId'] : 0;
$pdf_url      = isset( $attributes['pdfUrl'] ) ? $attributes['pdfUrl'] : '';
$filename     = isset( $attributes['pdfFilename'] ) ? $attributes['pdfFilename'] : '';
$size         = isset( $attributes['imageSize'] ) ? $attributes['imageSize'] : 'medium';
$alt          = isset( $attributes['imageAlt'] ) ? $attributes['imageAlt'] : '';
$pdf_title    = isset( $attributes['pdfTitle'] ) ? $attributes['pdfTitle'] : '';
$pdf_caption  = isset( $attributes['pdfCaption'] ) ? $attributes['pdfCaption'] : '';

// Ensure boolean fallbacks default to true if not explicitly set in the database context
$show_title   = isset( $attributes['showTitle'] ) ? (bool) $attributes['showTitle'] : true;
$show_caption = isset( $attributes['showCaption'] ) ? (bool) $attributes['showCaption'] : true;
$show_button  = isset( $attributes['showButton'] ) ? (bool) $attributes['showButton'] : false;

if ( empty( $pdf_url ) ) {
	return; 
}

if ( empty( $pdf_title ) && $pdf_id ) {
	$pdf_title = get_the_title( $pdf_id );
}
if ( empty( $pdf_caption ) && $pdf_id ) {
	$pdf_caption = wp_get_attachment_caption( $pdf_id );
}

// Create an accessible screen-reader announcement string
$accessible_label = ! empty( $pdf_title ) ? sprintf( __( 'Download PDF: %s', 'pdf-thumbnail-link' ), strip_tags( $pdf_title ) ) : sprintf( __( 'Download PDF file: %s', 'pdf-thumbnail-link' ), $filename );

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'pdf-thumbnail',
) );

echo '<div ' . $wrapper_attributes . '>';

// 1. Title
if ( $show_title && ! empty( $pdf_title ) ) {
	echo '<h3 class="pdf-thumbnail-title"><a title="' . esc_attr( $filename ) . '" href="' . esc_url( $pdf_url ) . '" aria-label="' . esc_attr( $accessible_label ) . '">' . wp_kses_post( $pdf_title ) . '</a></h3>';
}

// 2. Thumbnail Link
echo '<a class="link-to-pdf" title="' . esc_attr( $filename ) . '" href="' . esc_url( $pdf_url ) . '" aria-label="' . esc_attr( $accessible_label ) . '">';
if ( has_post_thumbnail( $pdf_id ) ) {
	echo get_the_post_thumbnail( $pdf_id, $size, array( 'alt' => $alt ) );
} else {
	echo wp_get_attachment_image( $pdf_id, $size, false, array( 'alt' => $alt ) );
}
echo '</a>';

// 3. Caption
if ( $show_caption && ! empty( $pdf_caption ) ) {
	echo '<p class="pdf-thumbnail-caption wp-caption-text">' . wp_kses_post( $pdf_caption ) . '</p>';
}

// 4. Forced Download Button
if ( $show_button ) {
	echo '<div class="wp-block-button pdf-download-button-wrap" style="margin-top: 1rem;">';
	echo '<a class="wp-block-button__link wp-element-button" href="' . esc_url( $pdf_url ) . '" download aria-label="' . esc_attr( $accessible_label ) . '">';
	echo esc_html__( 'Download PDF', 'pdf-thumbnail-link' );
	echo '</a>';
	echo '</div>';
}

echo '</div>';