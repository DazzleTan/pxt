namespace pxt.docs.codeCard {

    export interface CodeCardRenderOptions {
        hideHeader?: boolean;
        shortName?: boolean;
        render?: (xml: string, el: Node) => void;
    }

    export function render(card: pxt.CodeCard, options: CodeCardRenderOptions = {}): HTMLElement {
        const url = card.url ? /^[^:]+:\/\//.test(card.url) ? card.url : ('/' + card.url.replace(/^\.?\/?/, ''))
            : undefined;
        const link = !!url;
        const div = (parent: HTMLElement, cls: string, tag = "div", text: string | number = ''): HTMLElement => {
            let d = document.createElement(tag);
            if (cls)
                d.className = cls;
            if (parent) parent.appendChild(d);
            if (text) d.appendChild(document.createTextNode(text + ''));
            return d;
        }
        const a = (parent: HTMLElement, href: string, text: string, cls: string): HTMLAnchorElement => {
            let d = document.createElement('a');
            d.className = cls;
            d.href = href;
            d.appendChild(document.createTextNode(text));
            d.target = '_blank';
            parent.appendChild(d);
            return d;
        }

        let r = div(null, 'ui card ' + (card.color || '') + (link ? ' link' : ''), link ? "a" : "div");

        r.setAttribute("role", "option");
        r.setAttribute("aria-selected", "true");

        if (url) (r as HTMLAnchorElement).href = url;
        if (!options.hideHeader && card.header) {
            let h = div(r, "ui content " + (card.responsive ? " tall desktop only" : ""));
            div(h, 'description', 'span', card.header);
        }

        const name = (options.shortName ? card.shortName : '') || card.name;
        let img = div(r, "ui image" + (card.responsive ? " tall landscape only" : ""));

        if (card.label) {
            let lbl = document.createElement("label");
            lbl.className = `ui ${card.labelClass ? card.labelClass : "orange right ribbon"} label`;
            lbl.textContent = card.label;
            img.appendChild(lbl);
        }

        if (card.blocksXml && options.render)
            options.render(card.blocksXml, img);

        if (card.typeScript) {
            let pre = document.createElement("pre");
            pre.appendChild(document.createTextNode(card.typeScript));
            img.appendChild(pre);
        }

        if (card.imageUrl) {
            let imageWrapper = document.createElement("div") as HTMLDivElement;
            imageWrapper.className = "ui imagewrapper";
            let image = document.createElement("img") as HTMLImageElement;
            image.className = "ui cardimage";
            image.src = card.imageUrl;
            image.alt = name;
            image.onerror = () => {
                // failed to load, remove
                imageWrapper.remove();
            }
            image.setAttribute("role", "presentation");
            imageWrapper.appendChild(image);
            img.appendChild(imageWrapper);
        }

        if (card.youTubeId) {
            let screenshot = document.createElement("img") as HTMLImageElement;
            screenshot.className = "ui image";
            screenshot.src = `https://img.youtube.com/vi/${card.youTubeId}/0.jpg`;
            img.appendChild(screenshot)
        }

        if (card.cardType == "file") {
            let file = div(r, "ui fileimage");
            img.appendChild(file)
        }

        if (name || card.description) {
            let ct = div(r, "ui content");
            if (name) {
                r.setAttribute("aria-label", name);
                if (url && !link) a(ct, url, name, 'header');
                else div(ct, 'header', 'div', name);
            }
            if (card.description) {
                let descr = div(ct, 'ui description');
                descr.appendChild(document.createTextNode(card.description.split('.')[0] + '.'));
            }
        }

        if (card.time) {
            let meta = div(r, "meta");
            if (card.time) {
                let m = div(meta, "date", "span");
                m.appendChild(document.createTextNode(ts.pxtc.Util.timeSince(card.time)));
            }
        }

        if (card.extracontent) {
            let extracontent = div(r, "extra content", "div");
            extracontent.appendChild(document.createTextNode(card.extracontent));
        }

        return r;
    }
}