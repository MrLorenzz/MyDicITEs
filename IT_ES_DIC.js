class it_es_LingueeDictionary {
    constructor() {
        this.baseURL = 'https://www.linguee.com/italian-spanish/search?source=auto&query=';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('ES') != -1) return 'Diccionario IT->ES Linguee';
        return 'Linguee IT->ES Dictionary';
    }

    async findTerm(word) {
        this.word = word;
        let results = await this.findLingueeDict(word);
        return results;
    }

    async findLingueeDict(word) {
        let notes = [];
        if (!word) return notes; // return empty notes

        let url = this.baseURL + encodeURIComponent(word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return [];
        }

        // Intenta obtener las definiciones utilizando selectores específicos de Linguee
        let definitionElements = doc.querySelectorAll('.lemma .exact');
        let definitions = [];
        definitionElements.forEach(elem => {
            definitions.push(elem.innerText);
        });

        if (definitions.length > 0) {
            let css = this.renderCSS();
            notes.push({
                css,
                definitions,
            });
        } else {
            console.log('No definition found');
        }

        return notes;
    }

    renderCSS() {
        let css = '<style>A:link{TEXT-DECORATION:none}A:visited{TEXT-DECORATION:none}A:active{TEXT-DECORATION:none}A:hover{TEXT-DECORATION:none}</style>';
        return css;
    }
}
