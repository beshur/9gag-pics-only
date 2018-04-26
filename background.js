'use strict';

class NineGagPicsBackground {
  constructor() {
    this.LOG = '9GAG_BG';
    this.active = true;
    this.tabIds = [];

    this.loadStorage().then(function() {
      this.addRuntimeListener();
      this.addTabRemoveListener();
      this.addBrowserActionListener();
      console.log(this.LOG, 'init');
    }.bind(this))
  }

  loadStorage() {
    let option_keys = ['active'];
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(option_keys, (result) => {
        console.log('Storage value currently is ', result);
        if (typeof result.active !== 'undefined') {
          this.onActiveOptionUpdated(result.key);
        }
        resolve();
      });
    });
  }


  onActiveOptionUpdated(active) {
      this.active = active;
      this.notifyRegisteredTabs();
      this.updateBrowserAction();
  }

  setActiveOption(active) {
    chrome.storage.local.set({'active': active}, () => {
      console.log('Active value is set to ' + active);
      this.onActiveOptionUpdated(active);
    });
  }

  getActiveOption() {
    return this.active;
  }

  notifyRegisteredTabs() { 
    this.tabIds.forEach((id) => {
      chrome.tabs.sendMessage(id, {type: 'activation', value: this.getActiveOption()});
    });
  }

  updateBrowserAction() {
    chrome.browserAction.setIcon({path: this.getStateIcon()});
    chrome.browserAction.setTitle({title: this.getStateText()});
  }

  getIconPath() {
    return {
      'default': '/img/icon128.png',
      'disabled': '/img/icon128_disabled.png'
    }
  }

  getStateIcon() {
    let icons = this.getIconPath();
    if (!this.getActiveOption()) {
      return icons.disabled;
    }
    return icons.default;
  }

  getStateText() {
    let title = '9gag-pics';
    if (!this.getActiveOption()) {
      title += ' - disabled';
    }
    return title;
  }

  onRegister(message, sender, sendResponse) {
    console.log(this.LOG, 'onRegister', sender.tab.id);
    this.tabIds.push(sender.tab.id);
    sendResponse({
      registered: true,
      active: this.getActiveOption()
    });
  }
  onTabRemoved(tabId) {
    this.tabIds = this.tabIds.filter((item) => item !== tabId);
  }

  addTabRemoveListener() {
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      console.log(this.LOG, 'tab removed', tabId);
      this.onTabRemoved(tabId);
    });
  }

  addRuntimeListener() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      switch(message.type) {
        case 'register':
          this.onRegister(message, sender, sendResponse);
          break;
        default:
          console.log(this.LOG, 'message', message, sender);
          break;
      }
    }.bind(this));
  }

  addBrowserActionListener() {
    chrome.browserAction.onClicked.addListener(this.onBrowserAction.bind(this));
  }
  onBrowserAction() {
    console.log(this.LOG, 'browserAction clicked');
    this.setActiveOption(!this.getActiveOption());
  }
}

let NineGagPicsBackgroundInstance = new NineGagPicsBackground();