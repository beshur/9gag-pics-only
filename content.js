/* 9gag-pics-only Content JS */
'use strict';

class NineGagPics {


    constructor() {

        this.LOG = '9GAG_PICS_ONLY';
        this.postSelector = '.post-view';
        this.deferTimer = null;
        this.singlePost = !!document.querySelectorAll('#individual-post').length;
        this.active = true;

        this.getNativeAds = this.getNativeAds.bind(this);

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

    hideArticle(item) {
        if (!item) {
            return;
        }
        return item.closest('article').style.display = "none";
    }

    getNativeAds() {
        let articles = [...document.querySelectorAll('.list-stream article')];
        let articles_no_ids = articles.filter(item => !item.getAttribute('id'));

        return articles_no_ids;
    }
    hideByPostSelector() {
        if (this.singlePost || !this.active) {
            return;
        }
        let nonImagePosts = [...document.querySelectorAll(this.postSelector)];
        let nativeAds = this.getNativeAds();
        nonImagePosts.concat(nativeAds).forEach(this.hideArticle.bind(this));

        clearTimeout(this.deferTimer);
    }
}

var NineGagPicsInstance = new NineGagPics();