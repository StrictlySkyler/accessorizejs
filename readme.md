#In A Nutshell#

Accessorize.js is a JavaScript library meant to help make the web more accessible to people who have visual impairments, or are legally blind. It currently provides an interface to enable different methods of high-contrast viewing on a site, similar to methods available on modern day computer operating systems.

The ultimate goal of accessorize.js is to become a turnkey solution to help web developers make sites that are WCAG 2.0 AA compliant without sacrificing the awesome presentational stuff that came about with the rise of Web 2.0 (and beyond).

##How It Works##
To use accessorize.js, include it into the markup of a webpage -- preferably just before the end of the `<body>` tag. Then, add a button or a link elsewhere with the "accessorize" id and the "accessorizeNode" class. (Any element with the accessorizeNode class will be ignored when the library modifies the styles on the page.)

When the element with the accessorize id is clicked, it will provide an overlay to enable or disable various viewing modes aimed at making websites easier to read for people with vision impairment.

Right now, the options available are:

*	High Contrast
*	Inverted Contrast
*	Increased Font Size

Down the road, the following features are planned for implementation:

*	Adding WAI-ARIA Roles
*	Checking to see if there are any `<img>` elements without alt attributes
*	Catching links and content that makes no sense when taken out of context
*	Expose the ability to trigger the library from other scripts
*	Anything else I haven't thought of!
*	Enabling "High Contrast" attempts to turn all of the textual content on a site black in color with a white background, turn links and buttons blue with an underline, and to outline many structural block-level elements with a minimal shadow.

The "Invert Contrast" feature works just like the High Contrast feature, except that the content turns white with a black background, and the links turn yellow.

Both modes attempt to normalize images used as bullets for lists.

"Make Fonts Easier to Read" attempts to increase the size of any fonts below 18px to 18px, change the font to Arial, and remove any text-shadows which might be applied.

Disabling any of the above features attempts to restore the default state declared in a stylesheet or embedded `<style>` tag.

Elements added to the DOM via AJAX should be covered automatically.