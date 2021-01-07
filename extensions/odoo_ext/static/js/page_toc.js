(function ($) {

    document.addEventListener('DOMContentLoaded', () => {
        const pageTOC = document.getElementById('o_page_toc'); // The <aside> elem of the local toc
        if (pageTOC) { // The local toctree is not included for toctree pages (see layout.html)
            const headingRefs = pageTOC.querySelectorAll('a'); // The references to all headings

            // Always hide the TOC entry targeting the title (<h1> heading)
            _flagFirstHeadingRef(headingRefs);

            // If the page TOC has less than 2 headings, in addition to the title, hide it entirely
            if (headingRefs.length <= 2) {
                _hidePageTOC(pageTOC);
            }

            var lastFocus = headingRefs[0];

            // Add active class on list items referencing the section the user is currently reading.
            document.onscroll = event => {
                const offset = window.scrollY;
                // By default, focus on first element of the page TOC (page title)
                var newFocus = headingRefs[0];
                headingRefs.forEach(link => {
                    // Find the latest section whose offset from Top is lower than the current user
                    // scrolling offset.
                    let reference = link.getAttribute("href");
                    if (reference !== "#") {
                        // to ensure the selection works fine, we cannot use getElementById
                        // it doesn't work for sections generated by autodocumented modules
                        // Therefore, we find the section with id = reference (after removal of the # character)
                        let bodySection = document.querySelector(`section[id="${reference.substring(1)}"]`);
                        if (bodySection.offsetTop < offset) {
                            newFocus = link;
                        }
                    }
                });
                if (newFocus.href !== lastFocus.href) {
                    _removePreviousHighlight(pageTOC, lastFocus);
                    _highlightSectionOnPageToc(pageTOC, newFocus);
                    lastFocus = newFocus;
                }
            };
        }
    });

    /**
     * Add the class `o_page_toc_title` on the first heading reference.
     *
     * @param {NodeList} headingRefs - The references to the headings of the page
     */
    const _flagFirstHeadingRef = (headingRefs) => {
        headingRefs[0].classList.add('o_page_toc_title');
    };

    /**
     * Entirely hide the local tree of contents.
     *
     * @param {HTMLElement} pageTOC - The tree of contents of the page
     */
    const _hidePageTOC = (pageTOC) => {
        pageTOC.style.visibility = 'hidden';
    };

    /**
     * Add the "active" class on the parent List Item (<li/>)
     * of the given heading reference (<a>)
     *
     * @param {object} pageTOC
     * @param {object} headingRef - The node referencing the currently shown section
     */
    const _highlightSectionOnPageToc = (pageTOC, headingRef) => {
        var parent = headingRef.parentElement;
        while (parent !== pageTOC) {
            if (parent.tagName === "LI") {
                parent.classList.add('active');
            }
            parent = parent.parentElement;
        }
    };

    /**
     * Remove the "active" class on the parent List Item (<li/>)
     * of the given heading reference (<a>)
     *
     * @param {object} pageTOC
     * @param {object} headingRef - The node referencing the previously shown section
     */
    const _removePreviousHighlight = (pageTOC, headingRef) => {
        var parent = headingRef.parentElement;
        while (parent !== pageTOC) {
            if (parent.tagName === "LI") {
                parent.classList.remove('active');
            }
            parent = parent.parentElement;
        }
    };

})();
