(function(){
	//For future browser optimizations.  (Here's hoping?)
	'use strict';
	
	//For waiting until the document is loaded, jQuery style.
	var ready,
		accessorize;
	//Modern browsers.
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', ready, false);
		//Fallback to window.load, just in case.
		window.addEventListener('load', accessorize, false);
	//Old IE event model.
	} else if (document.attachEvent) {
		document.attachEvent('onreadystatechange', ready);
		//See fallback above.
		window.attachEvent('onload', accessorize);
	}
	
	//Cleanup the listeners once they're called, and call the main function.
	if (document.addEventListener) {
		ready = function() {
			document.removeEventListener('DOMContentLoaded', ready, false);
			accessorize();
		};
	} else if (document.attachEvent) {
		ready = function() {
			//Make sure eager IE waits for body to exist.
			if (document.readyState === 'complete') {
				document.detachEvent('onreadystatechange', ready);
				accessorize();
			}
		};
	}
	
	accessorize = function() {
		/****** Variables *****/
			//Grab the element to which this library is tied; the author suggests
			//using an anchor tag for semantic purposes, wrapped in a labeled div,
			//though any element with the appropriate ID should work.  It should
			//be styled to be high contrast, despite the site appearance otherwise.
		var handle = document.getElementById('accessorize'),
			parent = handle.parentNode,
			popup = document.createElement('div'),
			overlay = document.createElement('div'),
			contrastButton = document.createElement('a'),
			invertButton = document.createElement('a'),
			fontBigButton = document.createElement('a'),
			closePopup = document.createElement('a'),
			popupButtons = [contrastButton,invertButton,fontBigButton,closePopup],
			//Get all of the elements in the DOM, for working with later.
			everything = document.body.getElementsByTagName('*'),
			//Declare some things we'll use later.
			i,
			element,
			contrastOn = false,
			invertOn = false,
			fontBig = false,
			contrastSwitch,
			invertSwitch,
			fontBigSwitch,
			fontSizeMatch,
			turnOnContrast,
			turnOffContrast,
			turnOnInvert,
			turnOffInvert,
			turnOnFont,
			turnOffFont,
			//Sniff out if we're in IE...
			ieCheck = /MSIE \d/.exec(navigator.userAgent),
			//...Check our version if we are...
			ieVersion = /MSIE/.test(ieCheck) ? parseInt(/\d/.exec(ieCheck),10) : null,
			//...and report if it's one of the older ones.
			ieOld = ieVersion !== null && ieVersion < 9 ? true : false,
			//Check to see if we've enabled any of these accessibility features
			//in the past, or on another page in this domain.
			contrastCheck = /contrastOn=true/.test(document.cookie),
			invertCheck = /invertOn=true/.test(document.cookie),
			fontCheck = /fontBig=true/.test(document.cookie),
			//Listeners to add styles on the buttons created.  Added to the
			//elements further down.
			hover = function(elem) {
				elem.onmouseover = function mouseOn() {
					this.style.color = '#ffffff';
					this.style.background = '#333333';
					this.style.boxShadow = '0 0 5px 0 #000000';
				};
				
				elem.onmouseout = function mouseOut() {
					this.style.color = '#000000';
					this.style.background = '#ffffff';
					this.style.boxShadow = '0 0 1px 0 #000000';
				};
			
			},
			//Modify this later for AJAX elements added after page load.
			xhrMod = XMLHttpRequest.prototype.open;
		/***** End Variables *****/
		
		//Modify the XHR constructor.
		//Any time a new request is made, we want to do things to the new elements.
		XMLHttpRequest.prototype.open = function() {
			//Check to see if it's already been modified.
			if (typeof (this.listener) === 'function' && this.listener.apply(this, arguments) !== false) {
				//If it has, apply our new functionality.
				xhrMod.apply(this, arguments);
			}
		};
		//To be called when an XHR is made.  Applies styling to new elements.
		XMLHttpRequest.prototype.listener = function(method, url, async, user, pass) {
			
			if (contrastOn) {
				turnOnContrast();
			} else if (invertOn) {
				turnOnInvert();
			}
			if (fontBig) {
				turnOnFont();
			}
		};
		
		//Can be set to whatever scope is appropriate for your organization.
		//Should contain values such as:
		//	yourdomain.com => Most permissive, will track between sub-domains
		//	www.yourdomain.com => Default single domain
		//	subdomain.yourdomain.com => specific subdomain
		//Prefixed by 'domain=' on any of them.
		document.cookie = 'domain=localhost';
		
		//Give the elements some appropriate identification.
		popup.setAttribute('id', 'popup');
		overlay.setAttribute('id', 'overlay');
		closePopup.setAttribute('id', 'closePopup');
		contrastButton.setAttribute('id', 'contrastButton');
		invertButton.setAttribute('id', 'invertButton');
		fontBigButton.setAttribute('id', 'fontBigButton');
		
		//Give them content.
		contrastButton.innerHTML = 'Enable High Contrast';
		invertButton.innerHTML = 'Invert Contrast';
		fontBigButton.innerHTML = 'Make Fonts Easier to Read';
		closePopup.innerHTML = 'Close This Popup';
		
		//Insert the overlay as a sibling, after the handle in the DOM, and add the
		//popup to it.
		parent.insertBefore(overlay, handle.nextSibling);
		overlay.appendChild(popup);
		
		//Iterating through the buttons on the popup, adding them to the popup,
		//setting some styles on them, and making them keyboard navigable.
		for (i = 0, popupButtons.length; i < popupButtons.length; i++) {
			popup.appendChild(popupButtons[i]);
			popupButtons[i].style.cursor = 'pointer';
			popupButtons[i].style.padding = '5px';
			popupButtons[i].style.margin = '5px';
			popupButtons[i].style.display = 'block';
			popupButtons[i].style.border = '1px solid #333333';
			popupButtons[i].style.fontSize = '20px';
			popupButtons[i].style.textAlign = 'center';
			popupButtons[i].style.boxShadow = '0 0 1px 0 #000000';
			popupButtons[i].style.borderRadius = '3px';
			popupButtons[i].setAttribute('tabindex', '1');
			//Old versions of IE use a different syntax for the class attribute.
			if (ieOld) {
				popupButtons[i].setAttribute('className', 'accessorizeNode');
			} else {
				popupButtons[i].setAttribute('class', 'accessorizeNode');
			}
		}
		
		//Set a common style for the buttons, and add the earlier event listeners.
		for (i=0, popupButtons.length; i < popupButtons.length - 1; i++) {
			popupButtons[i].style.color = '#000000';
			hover(popupButtons[i]);
		}
		
		//Set the top and bottom buttons to have some nice more-rounded corners.
		popupButtons[0].style.borderRadius = '7px 7px 3px 3px';
		popupButtons[popupButtons.length - 1].style.borderRadius = '3px 3px 7px 7px';
		//The bottom button, which closes the popup, looks different to make it
		//easy to spot how it closes.
		closePopup.style.color = "#000000";
		closePopup.style.background = '#99ccff';
		closePopup.onmouseover = function mouseOn() {
			this.style.color = '#ffffff';
			this.style.background = '#333333';
			this.style.boxShadow = '0 0 5px 0 #000000';
		};
		
		closePopup.onmouseout = function mouseOut() {
			this.style.color = '#000000';
			this.style.background = '#99ccff';
			this.style.boxShadow = '0 0 1px 0 #000000';
			
		};
		
		//The overlay darkens the background transparently, making the popup easier
		//to see.
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.position = 'fixed';
		overlay.style.zIndex = '99998';
		overlay.style.display = 'none';
		overlay.style.left = '0';
		overlay.style.top = '0';
		//Filters and syntax differences for old IE, versus modern browsers.
		if (ieOld) {
			overlay.style.zoom = '1';
			overlay.style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#CC000000,endColorstr=#CC000000)';
			overlay.setAttribute('className', 'accessorizeNode');
			popup.setAttribute('className', 'accessorizeNode');
		} else {
			overlay.style.backgroundColor = 'rgba(0,0,0,.8)';
			overlay.setAttribute('class', 'accessorizeNode');
			popup.setAttribute('class', 'accessorizeNode');
			popup.style.borderRadius = '20px';
			popup.style.boxShadow = '0 0 10px #ffffff';
			popup.style.MozBorderRadius = '10px';
		}
		
		//Set the bounds of the popup, which is centered in the window.
		popup.style.width = '280px';
		popup.style.height = '172px';
		popup.style.background = '#ffffff';
		popup.style.display = 'block';
		popup.style.position = 'absolute';
		popup.style.zIndex = '99999';
		popup.style.border = '10px solid #333333';
		popup.style.left = ((document.getElementsByTagName('html')[0].clientWidth / 2) - 150).toString() + 'px';
		popup.style.top = ((document.getElementsByTagName('html')[0].clientHeight / 2) - 96).toString() + 'px';
		
		//Each of the listeners for button clicking.
		handle.onclick = function showPopup() {
			overlay.style.display = 'block';
		};
		
		closePopup.onclick = function closeClick() {
			overlay.style.display = 'none';
		};
		
		contrastButton.onclick = function contrastClick() {
			contrastSwitch();
		};
		
		invertButton.onclick = function invertClick() {
			invertSwitch();
		};
		
		fontBigButton.onclick = function fontBigClick() {
			fontBigSwitch();
		};
		
		//Switch the contrast when appropriate.
		contrastSwitch = function() {
			//Check to see if it's already on.  If not, turn it on and go.
			if (!contrastOn) {
				contrastOn = true;
				//The cookie will track according to the domain you set above.
				document.cookie = 'contrastOn=true';
				//Switch it on.
				turnOnContrast();
				
			} else {
				//If it's already on, turn it off and go.
				contrastOn = false;
				document.cookie = 'contrastOn=false';
				
				turnOffContrast();
			}
			//Check to see if we've also inverted the contrast, and adjust the
			//elements appropriately.
			if (invertOn) {
				invertOn = false;
				invertButton.innerHTML = 'Invert Contrast';
			}
		};
		
		//Same as the contrastSwitch function above, except we're inverting the
		//styles we used, since some folks find this easier to see.
		invertSwitch = function() {
			if (!invertOn) {
				invertOn = true;
				document.cookie = 'invertOn=true';
				
				turnOnInvert();
				
			} else {
				invertOn = false;
				document.cookie = 'invertOn=false';
				
				turnOffInvert();
			}
			if (contrastOn) {
				contrastOn = false;
				contrastButton.innerHTML = 'Enable High Contrast';
			}
		};
		
		//Make the fonts big, and remove custom fonts, which might make them hard
		//to read.
		fontBigSwitch = function() {
			if (!fontBig) {
				fontBig = true;
				document.cookie = 'fontBig=true';
				
				turnOnFont();
				
			} else {
				//Put the fonts back when we turn it off.
				fontBig = false;
				document.cookie = 'fontBig=false';
				
				turnOffFont();
			}
		};
		
		turnOnContrast = function() {
			//Iterate through everything that isn't created by this library.
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];		
				if (element.className !== 'accessorizeNode') {
					//Links are made blue on white, with an underline.
					if (
						(element.tagName === 'A')	||
						(element.parentNode.tagName === 'A')
						) {
						element.style.backgroundColor = '#ffffff';
						element.style.color = '#0000ff';
						element.style.textDecoration = 'underline';
					}
					//Content elements are made black on white.
					if (
						(element.tagName === 'P')			||
						(element.tagName === 'S')			||
						(element.tagName === 'I')			||
						(element.tagName === 'B')			||
						(element.tagName === 'DD')			||
						(element.tagName === 'DT')			||
						(element.tagName === 'EM')			||
						(element.tagName === 'H1')			||
						(element.tagName === 'H2')			||
						(element.tagName === 'H3')			||
						(element.tagName === 'H4')			||
						(element.tagName === 'H5')			||
						(element.tagName === 'H6')			||
						(element.tagName === 'ABBR')		||
						(element.tagName === 'CODE')		||
						(element.tagName === 'CITE')		||
						(element.tagName === 'SAMP')		||
						(element.tagName === 'SMALL')		||
						(element.tagName === 'STRONG')		||
						(element.tagName === 'ADDRESS')		||
						(element.tagName === 'BLOCKQUOTE')	||
						(element.tagName === 'AUDIO')		||
						(element.tagName === 'VIDEO')		||
						(element.tagName === 'INPUT')		||
						(element.tagName === 'TEXTAREA')	||
						(element.tagName === 'BUTTON')		||
						(element.tagName === 'SELECT')		||
						(element.tagName === 'LEGEND')		||
						(element.tagName === 'OPTION')		||
						(element.tagName === 'SECTION')		||
						(element.tagName === 'ARTICLE')		||
						(element.tagName === 'MARK')		||
						(element.tagName === 'FIGURE')		||
						(element.tagName === 'LABEL')		||
						(element.tagName === 'FIGCAPTION')	||
						(element.tagName === 'AUDIO')		||
						(element.tagName === 'CAPTION')		||
						(element.tagName === 'DEL')			||
						(element.tagName === 'TR')			||
						(element.tagName === 'TH')			||
						(element.tagName === 'TD')			||
						(element.tagName === 'DT')			||
						(element.tagName === 'DD')			||
						(element.tagName === 'INS')			||
						(element.tagName === 'SUB')			||
						(element.tagName === 'SUP')			||
						(element.tagName === 'SPAN')		||
						(element.tagName === 'PRE')			||
						(element.tagName === 'SUMMARY')
						) {
						element.style.background = '#ffffff';
						element.style.color = '#000000';
						element.style.borderRadius = '3px';
					}
					//Structural elements are made white, with a faint outline.
					//Box-shadow is used instead of border, since border will
					//modify the layout.  Old IE just jusn't get this, since
					//this many filters are performance intensive.
					if (
						(element.tagName === 'ASIDE')	||
						(element.tagName === 'DIV')		||
						(element.tagName === 'SECTION')	||
						(element.tagName === 'NAV')		||
						(element.tagName === 'TABLE')	
						) {
						element.style.background = '#ffffff';
						element.style.boxShadow = '0 0 0 1px #333333';
					}
					//Lists with custom bullets are forced to look
					//high-contrast.
					if (element.tagName === 'LI') {
						element.style.background = '#ffffff';
						element.style.color = '#000000';
						element.style.listStyleType = 'disc';
					}
				}
			}
			contrastButton.innerHTML = 'Disable High Contrast';
		};
		
		turnOffContrast = function() {
			//For all of the elements, attempt to remove the styles we've
			//added while preserving any other inline styles added by other
			//means.  In old IE, when the style is set to '', null, or
			//undefined, it overrides the CSS with the 'none' property, which
			//isn't what we want, so we have to remove the attribute.  (Sorry
			//inline styles in old IE.)  Otherwise, unless the style was set
			//inline via the markup and was one of the styles we modified, the
			//browsers will fall back to the default site styles.  If
			//you're setting your styles inline by hand, stop it and go get a
			//stylesheet.
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				if (
					(ieOld)	&&
					(element.className !== 'accessorizeNode')
				   ) {
					element.removeAttribute('style');
				}
				else if (element.className !== 'accessorizeNode') {
					element.style.background = '';
					element.style.color = '';
					element.style.listStyleType = '';
					element.style.boxShadow = '';
					element.style.borderRadius = '';
					element.style.textDecoration = '';
				}
			}
			contrastButton.innerHTML = 'Enable High Contrast';
		};
		
		turnOnInvert = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];		
				if (element.className !== 'accessorizeNode') {
					if (
						(element.tagName === 'A')	||
						(element.parentNode.tagName === 'A')
						) {
						element.style.backgroundColor = '#000000';
						element.style.color = '#ffff00';
						element.style.textDecoration = 'underline';
					}
					if (
						(element.tagName === 'P')			||
						(element.tagName === 'S')			||
						(element.tagName === 'I')			||
						(element.tagName === 'B')			||
						(element.tagName === 'DD')			||
						(element.tagName === 'DT')			||
						(element.tagName === 'EM')			||
						(element.tagName === 'H1')			||
						(element.tagName === 'H2')			||
						(element.tagName === 'H3')			||
						(element.tagName === 'H4')			||
						(element.tagName === 'H5')			||
						(element.tagName === 'H6')			||
						(element.tagName === 'ABBR')		||
						(element.tagName === 'CODE')		||
						(element.tagName === 'CITE')		||
						(element.tagName === 'SAMP')		||
						(element.tagName === 'SMALL')		||
						(element.tagName === 'STRONG')		||
						(element.tagName === 'ADDRESS')		||
						(element.tagName === 'BLOCKQUOTE')	||
						(element.tagName === 'AUDIO')		||
						(element.tagName === 'VIDEO')		||
						(element.tagName === 'INPUT')		||
						(element.tagName === 'TEXTAREA')	||
						(element.tagName === 'BUTTON')		||
						(element.tagName === 'SELECT')		||
						(element.tagName === 'LEGEND')		||
						(element.tagName === 'OPTION')		||
						(element.tagName === 'SECTION')		||
						(element.tagName === 'ARTICLE')		||
						(element.tagName === 'MARK')		||
						(element.tagName === 'FIGURE')		||
						(element.tagName === 'LABEL')		||
						(element.tagName === 'FIGCAPTION')	||
						(element.tagName === 'AUDIO')		||
						(element.tagName === 'CAPTION')		||
						(element.tagName === 'DEL')			||
						(element.tagName === 'TR')			||
						(element.tagName === 'TH')			||
						(element.tagName === 'TD')			||
						(element.tagName === 'DT')			||
						(element.tagName === 'DD')			||
						(element.tagName === 'INS')			||
						(element.tagName === 'SUB')			||
						(element.tagName === 'SUP')			||
						(element.tagName === 'SPAN')		||
						(element.tagName === 'PRE')			||
						(element.tagName === 'SUMMARY')
						) {
						element.style.background = '#000000';
						element.style.color = '#ffffff';
						element.style.borderRadius = '3px';
					}
					if (
						(element.tagName === 'ASIDE')	||
						(element.tagName === 'DIV')		||
						(element.tagName === 'SECTION')	||
						(element.tagName === 'NAV')		||
						(element.tagName === 'TABLE')	
						) {
						element.style.background = '#000000';
						element.style.boxShadow = '0 0 0 1px #cccccc';
					}
					if (element.tagName === 'LI') {
						element.style.background = '#000000';
						element.style.color = '#ffffff';
						element.style.listStyleType = 'disc';
					}
				}
			}
			invertButton.innerHTML = 'Revert Contrast';
		};
		
		turnOffInvert = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
					element = everything[i];		
					if (
						(ieOld)	&&
						(element.className !== 'accessorizeNode')
					   ) {
						element.removeAttribute('style');
					}
					else if (element.className !== 'accessorizeNode') {
						element.style.background = '';
						element.style.color = '';
						element.style.listStyleType = '';
						element.style.boxShadow = '';
						element.style.borderRadius = '';
						element.style.textDecoration = '';
					}
				}
				invertButton.innerHTML = 'Invert Contrast';
		};
		
		turnOnFont = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				
				//Old IE reports computed styles differently than modern
				//browsers.
				if (ieOld) {
					//Grab out the number in the font setting.
					fontSizeMatch = parseInt((element.currentStyle.fontSize).match(/\d+/), 10);
					//Test for relative, inheriting font-sizes, and set them
					//to a default, since finding out where their inheritence
					//originates is impractical.
					if (/em|%/.test(element.currentStyle.fontSize)) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
					//If pixels or points (yuck), and less than 18 in size,
					//then make them bigger.
					if (
							(
								(/px/.test(element.currentStyle.fontSize)) &&
								(fontSizeMatch < 18)
							)	||
							(
								(/pt/.test(element.currentStyle.fontSize)) &&
								(fontSizeMatch < 18)
							)
						) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
					
				} else {
					//Modern browsers report font size in calculated pixels,
					//unless specified as em or %.  Grab 'em out by the
					//number, test for which we have, and set accordingly.
					fontSizeMatch = parseInt((document.defaultView.getComputedStyle(element).getPropertyValue('font-size')).match(/\d+/), 10);
					if (/em|%/.test(document.defaultView.getComputedStyle(element).getPropertyValue('font-size'))) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
					if (
						(/px/.test(document.defaultView.getComputedStyle(element).getPropertyValue('font-size')))	&&
						(fontSizeMatch < 18)
						) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
				}
			}
			fontBigButton.innerHTML = 'Restore Default Fonts';
		};
		
		turnOffFont = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				//Check to see if the elements have been modified by elsewhere.
				if (
					(element.className !== 'accessorizeNode')	&&
					(
						(contrastOn)	||
						(invertOn)
					)
					) {
					element.style.fontSize = '';
					element.style.fontFamily = '';
				}
				//If not, then do what old IE needs, or other modern browsers
				//can support.
				else if (
					(ieOld)	&&
					(element.className !== 'accessorizeNode')
				   ) {
					element.removeAttribute('style');
				}
				else if (element.className !== 'accessorizeNode') {
					element.style.fontSize = '';
					element.style.fontFamily = '';
				}
			}
			fontBigButton.innerHTML = 'Make Fonts Easier to Read';
		};
		
		//Check to see if these are already enabled on another page, and enable
		//them here if they are.
		if (contrastCheck) {
			contrastSwitch();
		}
		
		if (invertCheck) {
			invertSwitch();
		}
		
		if (fontCheck) {
			fontBigSwitch();	
		}
	};
	
}());