function receiveDataFromAndroid (data){
  console.log(data);
    //  window.dispatchEvent(new CustomEvent("storage", { detail: data }));
}

window.addEventListener('offline', () => {
  window.dispatchEvent(new CustomEvent("offlineEvent", { detail: true}));
});
window.addEventListener('online', () => {
  window.dispatchEvent(new CustomEvent("onlineEvent", { detail: false}));
});