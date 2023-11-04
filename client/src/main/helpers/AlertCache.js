const CacheBase = require('cache-base');
const cache_ = new CacheBase();

export default class AlertCache {
    //static cache_ = new cache();
    static set(key, value) {
        cache_.set(key.toString(), value);
    }

    static get(key) {

        return cache_.get(key.toString());
    }

    static cache() {
        return cache_;
    }

    static size() {
        return cache_.size;
    }
}