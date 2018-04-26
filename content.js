/* 9gag-pics-only Content JS */
'use strict';

class NineGagPics {


    constructor() {

        this.LOG = '9GAG_PICS_ONLY';
        this.postSelector = '.post-view';
        this.deferTimer = null;
        this.singlePost = !!document.querySelectorAll('#individual-post').length;
        this.active = true;

        console.info(this.LOG, 'Init');
        this.setScrollHandler();
        this.registerInBackground();
        chrome.runtime.onMessage.addListener(this.onRuntimeMessage.bind(this));
    }

    registerInBackground() {
        chrome.runtime.sendMessage({type: 'register'}, (response) => {
            console.log(this.LOG, 'registerInBackground response', response);
            if (typeof response.active !== 'undefined') {
                this.setActive(response.active);
            }
            this.hideByPostSelector();
        });
    }

    setActive(active) {
        this.active = active;
    }

    setScrollHandler() {
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onRuntimeMessage(request, sender, sendResponse) {
        console.log(this.LOG, 'onRuntimeMessage', ...arguments);
        switch(request.type) {
            case 'activation':
                this.onActivation(request, sender, sendResponse);
                break;
            default:
                break;
        }

    }

    onActivation(request, sender, sendResponse) {
        this.setActive(request.value);
    }

    onScroll(event) {

        if (this.deferTimer) {
            clearTimeout(this.deferTimer);
        }
        this.deferTimer = setTimeout(this.hideByPostSelector.bind(this), 100);
    }

    hideByPostSelector() {
        if (this.singlePost || !this.active) {
            return;
        }
        document.querySelectorAll(this.postSelector).forEach(function(item) {
            item.closest('article').style.display = "none"
        });

        clearTimeout(this.deferTimer);
    }
}

var NineGagPicsInstance = new NineGagPics();