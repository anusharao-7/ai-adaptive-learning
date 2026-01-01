import DOMPurify from 'dompurify';

/**
 * Sanitizes SVG content to prevent XSS attacks.
 * Removes script tags, event handlers, and other dangerous elements.
 */
export function sanitizeSVG(svg: string | null | undefined): string {
  if (!svg) return '';
  
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'],
  });
}

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * More restrictive than SVG sanitization.
 */
export function sanitizeHTML(html: string | null | undefined): string {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onsubmit'],
  });
}
