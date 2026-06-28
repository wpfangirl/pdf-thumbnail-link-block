<?php
/**
 * PDF Thumbnail Block Frontend Render
 *
 * @package       WPFangirl
 * @version       1.2.0
 */

$pdf_id       = isset( $attributes['pdfId'] ) ? $attributes['pdfId'] : 0;
$pdf_url      = isset( $attributes['pdfUrl'] ) ? $attributes['pdfUrl'] : '';
$filename     = isset( $attributes['pdfFilename'] ) ? $attributes['pdfFilename'] : '';
$size         = isset( $attributes['imageSize'] ) ? $attributes['imageSize'] : 'medium';
$alt          = isset( $attributes['imageAlt'] ) ? $attributes['imageAlt'] : '';
$pdf_title    = isset( $attributes['pdfTitle'] ) ? $attributes['pdfTitle'] : '';
$pdf_caption  = isset( $attributes['pdfCaption'] ) ? $attributes['pdfCaption'] : '';
$show_title   = isset( $attributes['showTitle'] ) ? $attributes['showTitle'] : true;
$show_caption = isset( $attributes['showCaption'] ) ? $attributes['showCaption'] : true;

if ( empty( $pdf_url ) ) {
	return; 
}

// Fallback logic if database strings exist but attributes were completely empty
if ( empty( $pdf_title ) && $pdf_id ) {
	$pdf_title = get_the_title( $pdf_id );
}
if ( empty( $pdf_caption ) && $pdf_id ) {
	$pdf_caption = wp_get_attachment_caption( $pdf_id );
}

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'pdf-thumbnail',
) );

echo '<div ' . $wrapper_attributes . '>';

// 1. Output Heading/Title if toggled ON
if ( $show_title && ! empty( $pdf_title ) ) {
	echo '<h3 class="pdf-thumbnail-title"><a title="' . esc_attr( $filename ) . '" href="' . esc_url( $pdf_url ) . '">' . wp_kses_post( $pdf_title ) . '</a></h3>';
}

// 2. Output the Thumbnail Link
echo '<a class="link-to-pdf" title="' . esc_attr( $filename ) . '" href="' . esc_url( $pdf_url ) . '">';
if ( has_post_thumbnail( $pdf_id ) ) {
	echo get_the_post_thumbnail( $pdf_id, $size, array( 'alt' => $alt ) );
} else {
	echo wp_get_attachment_image( $pdf_id, $size, false, array( 'alt' => $alt ) );
}
echo '</a>';

// 3. Output Caption if toggled ON
if ( $show_caption && ! empty( $pdf_caption ) ) {
	echo '<p class="pdf-thumbnail-caption wp-caption-text">' . wp_kses_post( $pdf_caption ) . '</p>';
}

echo '</div>';