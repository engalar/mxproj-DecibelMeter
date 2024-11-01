// service-worker.js

// 设置缓存名称和文件
const CACHE_NAME = 'mendix-cache-name';
const urlsToCache = [
    '/',
    '/index.html',  // 缓存 index.html 文件
    '/index.html?profile=Responsive',
    // 其他静态资源
];

// 安装事件
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        }).then(() => self.skipWaiting())
    );
});

// 激活事件
self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );

    // event.waitUntil(
    //     Promise.all([self.clients.claim(),/* clearCaches(), */ deleteDatabase(), self.registration.unregister()/* , reloadClients() */])
    // );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        console.log('拦截到网络请求:', event.request.url);
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                // 如果找到缓存中的响应，直接返回。
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 如果没有找到缓存中的响应，从网络获取
                return caches.open(CACHE_NAME).then(cache => {
                    return fetch(event.request).then(response => {
                        // 仅保存有效的响应到缓存中
                        if (!response || response.status !== 200) {
                            return response; // 响应无效时直接返回
                        }

                        // 复制响应并存入运行时缓存，以免消费原始响应
                        cache.put(event.request, response.clone());
                        return response; // 返回原始响应
                    }).catch(error => {
                        console.log('网络请求失败:', error);
                        throw error; // 处理网络请求错误
                    });
                });
            })
        );
    }
});


async function clearCaches() {
    const cacheKeys = await caches.keys();
    const mendixCacheKeys = cacheKeys.filter(key => key.startsWith("mendix-"));
    await Promise.all(mendixCacheKeys.map(key => caches.delete(key)));
}

async function deleteDatabase() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase("workbox-expiration");
        req.onsuccess = resolve;
        req.onerror = reject;
        req.onblocked = reject;
    });
}

async function reloadClients() {
    const clients = await self.clients.matchAll({ type: "window" });
    await Promise.all(clients.map(client => client.navigate(client.url)));
}
