(function() {
	'use strict';

	var accessorize = {
		
		handle : document.getElementById('accessorize'),
		parent : handle.parentNode(),
		content : document.querySelectorAll('P, S, I, B, DD, DT, EM, H1, H2, ' +
											'H3, H4, H5, H6, ABBR, CODE, CITE' +
											', SAMP, SMALL, STRONG, ADDRESS, ' +
											'BLOCKQUOTE, AUDIO, VIDEO, INPUT,' +
											'TEXTAREA, SELECT, LEGEND, OPTION' +
											', SECTION, ARTICLE, MARK, FIGURE' +
											', LABEL, FIGCAPTION, CAPTION, DE' +
											'L, TR, TH, TD, DT, DD, INS, SUB,' +
											'SUP, SPAN, PRE, SUMMARY'),
		links : document.querySelectorAll('A, BUTTON'),
		structure : document.querySelectorAll('ASIDE, DIV, SECTION, NAV,' +
											  'TABLE'),
		
		
		
	};

}());