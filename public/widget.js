const initialStatus = {
  isClosed: false,
  isAccepted: false,
  isRejected: false,
};

// const txnData = {
//   txnid: '',
// };
const btn = document.getElementById('FIU-widget-submit');
const input = document.getElementById('FIU-widget-input-id');

const mobileForm = document.getElementById('mobile-number-form');
const statusText = document.getElementById('status-message');

let inputValue = input.value;

let msg = '';

function handleChange(e) {
  const { value } = e.target || {};
  inputValue = value;
}

async function apiCall(args = {}) {
  const { options, url } = args;
  try {
    const response = await fetch(url, options);
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function WidgetSubmit() {
  const body = {
    clienttrnxid: '097c78d5-c0b4-425b-9207-f36831f3117b',
    fiuID: 'Jar_UAT',
    userId: 'Jar_UAT',
    aaCustomerHandleId: `${inputValue}@CAMSAA`,
    aaCustomerMobile: inputValue,
    redirection_key: 'lZWbyVsReyzDsz',
    fipid: 'fipuat@citybank',
    // fipid: 'AXIS001',
    // fipid: "HDFC",
    //  fipid: 'fipcamsuat@citybank',
    addfip: 'TRUE',
    useCaseid: '103',
    redirect: '',
    Integrated_trigger_sms_email: 'Y'
  };
  const width = (window.innerWidth * 2) / 3;
  const height = (window.innerHeight * 2) / 3;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  var urls = new URL(location.origin)
  urls.searchParams.append('data', JSON.stringify(body));
  const newWindow = window.open(
    urls,
    '_blank',
    `width=390,height=844,top=${top},left=${left},location=yes,scrollbars=yes, status=yes`,
  );
  window.addEventListener(
    'message',
    function (e) {
      // console.log('Message received === ', e.data);
      if (e.source !== newWindow) {
        return;
      }
      // console.log(e.data);
      // console.log('origin = ',e.origin)
      const { status, text = '', message } = e.data || {};

      const messageMap = {
        S: 'Consent is accepted',
        F: 'Consent is rejected',
        N: 'Window is closed by user',
      };

      let messageToDisplay =
        message || messageMap[status] || 'Window is closed by user';
      if (status === 'S') {
        displayMessage(messageToDisplay, true);
        initialStatus.isAccepted = true;
        if (text) {
          msg += text;
        }
      }
      if (status === 'F') {
        displayMessage(messageToDisplay);
        initialStatus.isRejected = true;
      }
    },
    false,
  );
  const interval = setInterval(() => {
    if (newWindow.closed) {
      initialStatus.isClosed = true;
      clearInterval(interval);
    }
  }, 1000);
}

async function getRedirectionURL(args = {}) {
  const { token, sessionId, aaID } = args || {};
  const url = 'https://uatapp.finduit.in/api/FIU/RedirectAA';
  const body = {
    clienttrnxid: '097c78d5-c0b4-425b-9207-f36831f3117b',
    fiuID: 'STERLING-FIU-UAT',
    userId: 'sterlingfiu',
    aaCustomerHandleId: `${aaID}@CAMSAA`,
    aaCustomerMobile: aaID,
    sessionId,
    //  fipid: 'fipuat@citybank',
    fipid: "AXIS001",
    // fipid: 'fipcamsuat@citybank',
    addfip: 'False',
    useCaseid: '1',
    redirect: '',
  };
  const options = {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  };
  const result = await apiCall({ url, options });
  const { redirectionurl /*sessionId,txnId,clienttxnid*/ } = await result.json();
  if (redirectionurl) {
    const width = (window.innerWidth * 2) / 3;
    const height = (window.innerHeight * 2) / 3;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const parsedUrlSearchParams = `${new URL(
      redirectionurl,
    ).searchParams.toString()}`;

    const newWindow = window.open(
      new URL('?' + parsedUrlSearchParams, location.origin),
      '_blank',
      `width=390,height=844,top=${top},left=${left},location=yes,scrollbars=yes, status=yes`,
    );
    window.addEventListener(
      'message',
      function (e) {
        // console.log('Message received === ', e.data);
        if (e.source !== newWindow) {
          return;
        }
        // console.log(e.data);
        // console.log('origin = ',e.origin)
        const { status, text = '', message } = e.data || {};

        const messageMap = {
          S: 'Consent is accepted',
          F: 'Consent is rejected',
          N: 'Window is closed by user',
        };

        let messageToDisplay =
          message || messageMap[status] || 'Window is closed by user';
        if (status === 'S') {
          displayMessage(messageToDisplay, true);
          initialStatus.isAccepted = true;
          if (text) {
            msg += text;
          }
        }
        if (status === 'F') {
          displayMessage(messageToDisplay);
          initialStatus.isRejected = true;
        }
      },
      false,
    );
    const interval = setInterval(() => {
      if (newWindow.closed) {
        initialStatus.isClosed = true;
        clearInterval(interval);
      }
    }, 1000);
  }
}

input.addEventListener('change', handleChange);

// async function WidgetSubmit() {
//   btn.innerText = 'Waiting for the Consent...';
//   btn.disabled = true;
//   btn.style.opacity = '0.5';
//   const body = {
//     fiuID: 'STERLING-FIU-UAT',
//     redirection_key: 'DSTKnxbUAlPukv',
//     userId: 'sterlingfiu',
//   };
//   const url = 'https://uatapp.finduit.in/api/FIU/Authentication';
//   const options = {
//     headers: {
//       'Content-Type': 'application/json ',
//     },
//     method: 'POST',
//     body: JSON.stringify(body),
//   };
//   const result = await apiCall({ url, options });
//   const { token, sessionId } = await result.json();
//   if (token && sessionId) {
//     getRedirectionURL({ token, sessionId, aaID: inputValue });
//   }
// }

const interval = setInterval(() => {
  if (initialStatus.isAccepted && initialStatus.isClosed && !initialStatus.isRejected) {
    btn.innerText = 'Provide Consent';
    btn.disabled = false;
    btn.style.opacity = '1';
    clearInterval(interval);
  }
  if (!initialStatus.isAccepted && initialStatus.isClosed && initialStatus.isRejected) {
    btn.innerText = 'Provide Consent';
    btn.disabled = false;
    btn.style.opacity = '1';
    clearInterval(interval);
  }
  if (!initialStatus.isAccepted && initialStatus.isClosed && !initialStatus.isRejected) {
    displayMessage('Window is closed by user');
    btn.innerText = 'Provide Consent';
    btn.disabled = false;
    btn.style.opacity = '1';
    clearInterval(interval);
  }
}, 1000);

function displayMessage(message, success) {
  mobileForm.style.display = 'none';
  statusText.style.display = 'block';
  statusText.innerHTML = message;

  if (success) {
    statusText.style.color = 'darkgreen';
  }
}
