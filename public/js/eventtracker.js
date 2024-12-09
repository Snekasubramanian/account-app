export function eventTracker(eventName,EventData) {
    if (navigator.userAgent.match(/Android/i) != null && !!window.app) {
        window.app.myAndroidMethod(eventName,JSON.stringify(EventData));
    } else if ((navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null)) {
        const event = new CustomEvent('Jar', {detail:EventData});
        window.dispatchEvent(event);
    } else if ((navigator.userAgent.match(/iPad/i) != null) || (navigator.userAgent.match(/CriOS/i) != null)) {
        const event = new CustomEvent('Jar', {detail:EventData});
        window.dispatchEvent(event);
    } else {
        console.log("EventTracker",eventName,EventData);
    }
}

export function getotp() {
    if (navigator.userAgent.match(/Android/i) != null && !!window.android) {
        let value = window.android.FetchOtp();
        if(!!value){
            window.dispatchEvent(new CustomEvent("storage", { detail: value }));
        }
    }
  }
