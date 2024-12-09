import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  CardMedia,
  Checkbox,
  Grid,
  Skeleton,
  Typography,
  Button,
  RadioGroup, Radio
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import images from '../../../public/images/submit.json'
import { useLocation, useNavigate } from 'react-router-dom';
import "@fontsource/inter";
import LinearProgress from '@mui/material/LinearProgress';

import {
  AlreadyLinkedAccountsList,
  bankDetail,
  ConsentArtefact,
  ConsentArtefactRequestBody,
  consentHandle,
  consentHandleDetailsRequestBody,
  discoverBanks,
  discoverBanksRequestBody,
  discoverBanksResponseBody,
  FIPDetailsList,
  FipNewDiscoverelist,
  IndBank,
  LinkAccountRequestBody,
  LinkBankAccount,
  LinkDescResponseBody,
} from '../../api/banks';
import { ConsentRejectRequestBody, rejectConsent } from '../../api/banks';
import { IMAGE_BASE_URL } from '../../api/urls';
import { browserName, closeAndRedirect, eventTracker, FetchOtp, logEvent } from '../../lib/helper';
import { RootStateType } from '../../store/reducers';
import {
  ADD_SELECTED_BANK_LIST,
  BankState,
  SET_CONSUMER_DETAILS,
  BANK_LIST,
  DISCOVER_REPONSE,
} from '../../store/types/bankListType';
import { AuthState } from '../../store/types/login';
import ConfirmationBottomDrawer from '../BottomDrawer/ConfirmationBottomDrawer';
import ConsentDetailsDrawer from '../BottomDrawer/ConsentDetailsDrawer';
import Header from '../header/index';
import OtpDrawer from '../BottomDrawer/OtpDrawer';
import RedirectingModal from '../RedirectingModal';
import "@fontsource/inter";
import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from '../BankSelectionCheckbox';
import { AuthBankState } from '../../store/reducers/authenticatedBanksReducer';
import moment from 'moment';
import DetailsDrawer from '../BottomDrawer/DetailsDrawer';
import LottieAnima from '../lottie/LottieAnima';
//import SuccesSubmit from '../SuccesSubmit';

function AccountCard({
  account,
  accountNo,
  accountType,
  checked,
  onChange,
  // onClick,
  linked = false,
  Logo,
  accountName,
}: {
  account: any;
  accountNo: string;
  accountType: string;
  checked: boolean;
  linked: any;
  //onClick: any;
  Logo: any;
  accountName: any;
  onChange: any;
}) {
  const dispatch = useDispatch();

  const selectAccount = (acc: any) => {
    dispatch({
      type: 'SELECT_ACCOUNT',
      body: { selectedAccount: acc },
    });
  };

  const { bankList, consumer } = useSelector<RootStateType, BankState>(
    (state) => state.bank,
  );

  const currentDate = moment().subtract(5, 'hours').subtract(30, 'minutes');
  const minutesDifference = currentDate.diff(moment(account.LINKEDDATE), 'minutes');
  // const specifiedDate = new Date(account.LINKEDDATE!)
  // const addedTime = new Date(specifiedDate.getTime());
  // addedTime.setHours(addedTime.getHours() + 5);
  // addedTime.setMinutes(addedTime.getMinutes() + 30);
  // const timeDifference = currentDate.getTime() - addedTime.getTime()
  // const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const accNo = accountNo.includes("*") ? accountNo.replaceAll('*', 'X') : accountNo

  return (
    <Grid
      xs={12}
      onClick={() => {
        bankList.length > 1 ? selectAccount(account) : ""
      }}
    >
      <Box
        sx={{
          borderRadius: '8px',
          // py: 0.5,
          // //px: 0.75,
          marginBottom: '12px',
          padding: '16px',
          backgroundColor: bankList.length > 1 ? checked ? '#3C3357' : "#272239" : "#2E2942",
          border: bankList.length > 1 ? checked ? '1px solid #C5B0FF' : "1px solid #776E94" : "none",
          width: '100%',
          // height: bankList.length > 1 ? linked ? '118px' : '90px' : '118px',
          position: 'relative',
          gap: '12px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            // height: '32px',
            // width: '100%',
            //margin: '8px 10px',
            // marginTop: 1,
            display: 'flex',
            // border:'solid red',
            // marginBottom: '8px',
            alignItems: 'center',
            // justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{ display: 'flex' }}>
            <img
              style={{
                width: '28px',
                height: '28px',
                // objectFit: 'contain',
                // margin: 'auto',
                // borderRadius: '1em',
                borderRadius: '50%'
              }}
              src={Logo}
            />
          </Box>
          <Box sx={{ paddingLeft: '10px' }} >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 600,
                color: 'white',
                fontStyle: 'normal',
                padding: '3.5px 8px',
                textTransform: 'uppercase'
              }}
            >
              {accountName}
            </Typography>
          </Box>
          {bankList?.length > 1 && <Box sx={{ position: 'absolute', right: '8px', top: '10px' }}>
            {/* <Checkbox className='test'
              defaultChecked
              checked={checked}
              icon={<CheckboxUncheckedIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              size="small" /> */}
            <Radio className='test'
              checked={checked}
              color="primary"
              name="radio-buttons"
              icon={<CheckboxUncheckedIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
            />
          </Box>}
        </Box>
        <Box  sx={{
          display:'flex',
          flexDirection:'column',
          gap:'8px'
        }}>
          <Typography
            sx={{
              color: 'white',
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '18px',
              fontStyle: 'normal',
              // padding: '0px 0px 2px 0px'
            }}>
            {accountType[0].toUpperCase() +
              accountType.substring(1).toLowerCase() +
              ' a/c: ' + accNo
            }
          </Typography>
          {linked && minutesDifference > 1 ? (
          <Box
            sx={{
              // height: '19px',
              display: 'flex',
              // paddingTop: '10px'
            }}
          >
            <CardMedia
              component="img"
              image="/images/green tick.svg"
              alt="tick"
              sx={{ width: '12px', height: '12px', margin: '1px 0px' }}
            />
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '13px',
                color: '#58DDC8',
                // padding: '1px 1px 1px 3px'
              }}
            >
              Your account is already linked
            </Typography>
          </Box>
        ) : linked && minutesDifference <= 1 ? (
          <Box
            sx={{
              // height: '19px',
              display: 'flex',
              paddingTop: '10px'
            }}
          >
            <CardMedia
              component="img"
              image="/images/green tick.svg"
              alt="tick"
              sx={{ width: '12px', height: '12px', margin: '3.7px 0px' }}
            />
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#58DDC8',
                padding: '1px 1px 1px 3px'
              }}
            >
              Your account is linked
            </Typography>
          </Box>
        ) : <></>
        }
        </Box>
       
        {/* {bankList.length === 1 && !linked &&
          (
            <Box
              sx={{
                // height: '18px',
                marginTop: 1,
                // display: 'flex',
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: 'white',
                }}
              >
                OTP has been sent to link your bank account
              </Typography>
            </Box>)} */}
      </Box>
    </Grid>
  );
}
function BankCard({
  checkedBanks,
  onAddBank,
  discovered,
  linked,
}: {
  checkedBanks: (AlreadyLinkedAccountsList | FipNewDiscoverelist)[];
  onAddBank: (status: boolean, bank: any) => void;
  discovered: any;
  linked: LinkDescResponseBody | undefined;
}) {
  const dispatch = useDispatch();

  return (
    <>
      <Box>
        <Box
          sx={{
            width: '100%',
            borderRadius: '8px',
            // paddingTop: '12px'
            // border:'solid red'
          }}
        >
          {discovered?.length &&
            discovered.map((bankAccount: any, index: any) => {
              const {
                FIPACCTYPE,
                FIPACCNUM,
                FIPACCREFNUM,
                Logo,
                FIPNAME,
                Linked,
                isChecked,
              } = bankAccount;
              return (
                <AccountCard
                  key={FIPACCREFNUM + index}
                  account={bankAccount}
                  accountNo={FIPACCNUM}
                  accountType={FIPACCTYPE}
                  Logo={IMAGE_BASE_URL + Logo}
                  accountName={FIPNAME}
                  linked={Linked}
                  checked={isChecked}
                  onChange={(status: boolean) => onAddBank(status, bankAccount)}
                />
              );
            })
          }
        </Box>
      </Box>
    </>
  );
}
export default function ConfirmAccount() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [stopbar, setStopbar] = useState(false);
  const [animate, setAnimate] = useState("");
  const [btmanimate, setbtmAnimate] = useState("");
  const waitTime = 10;
  const carouselText = [
    '🔒 All your data is end-to-end encrypted.',
    '3.9 million accounts are linked already.',
    'No hassles of uploading documents/sharing passwords/leaving a paper trail.',
    'CAMSfinserv is a RBI regulated platform.',
  ];
  let timer: any;
  // From Discover API
  const [discoveredbank, setDiscoveredBank] = useState<discoverBanksResponseBody>();

  // From LinkDesc API
  const [linkedAccounts, setLinkedAccounts] = useState<LinkDescResponseBody>();
  const { authBanks } = useSelector<RootStateType, AuthBankState>(
    (state) => state.authBanks,
  );
  // From GETCONSENTHANDLEDETAILS API
  const [consentHandleData, setConsentHandle] = useState<any>({});
  const [isVerified, setIsVerified] = useState(false);
  const [isAutosubmit, setIsAutosubmit] = useState(true);
  // Show loading dialog
  //const [loader, setLoader] = useState(true);

  const dispatch = useDispatch();

  // Modal confirmation response.
  const [confirm, setConfirm] = useState(false);

  // Checkbox to maintain state.
  const [loader1, setLoader1] = useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: '',
  });
  const [loader, setLoader] = useState(true);
  const [animateLoader, setAnimateLoader] = useState(false);
  const location = useLocation();
  const [consentDrawer, setConsentDrawer] = useState(false);
  const [otpDrawer, setOtpDrawer] = useState(false);
  const [linkResponse, setLinkResponse] = useState<any>();
  const [timeRemaining, setTimeRemaining] = useState<number>(waitTime);
  const [tryAgain, setTryAgain] = useState(false);
  const [detailsDrawer, setDetailsDrawer] = useState(false);
  const [otploader, setotpLoader] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [loaderDrawer, setLoaderDrawer] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const { decrypt, addNumberFlow } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  // SelectedBank is an object that saved the list of discovered banks that are pending to be linked per phone number.
  const { bankList, consumer } = useSelector<RootStateType, BankState>(
    (state) => state.bank,
  );

  const [checkedBanks, setCheckedBanks] = useState<FipNewDiscoverelist[]>([]);
  const [submitlabel, setSubmitlabel] = useState("");
  const prevlabelRef = useRef<any>("");
  // From Add account page.
  const selectedFips: bankDetail = (location.state as any)?.choosedBank;
  // From Add account page.
  const phoneNumber: string | null = (location.state as any)?.phoneNumber;

  // Local change in checkbox selection.
  const onAddBank = async (status: boolean, bank: any) => {
    if (status) {
      // TODO: to remove ability to select only one
      const selectedBanks: IndBank[] = [bank];
      setCheckedBanks(selectedBanks);
    } else {
      // TODO: to remove ability to select only one
      const selectedBanks = checkedBanks.filter(function (bank1) {
        return bank1.FIPACCREFNUM !== bank.FIPACCREFNUM;
      });
      setCheckedBanks(selectedBanks);
    }
  };

  const provideConsent = async () => {
    try {
      if (bankList.length > 0) {
        let fiterCheckedAccount = bankList.filter((x: any) => x.isChecked);
        if (isAutosubmit) {
          eventTracker('RLending_BankStatementLinkAccountFlow', {
            action: 'submit_clicked',
            auto_submit: true,
            screen: 'link_account_screen',
            bank_name: discoveredbank?.FIPName,
            count_of_accounts: discoveredbank?.AccountCount,
            count_of_selected_account: bankList.filter((acc: any) => acc.isChecked).length,
            count_of_deselected_account: bankList.filter((acc: any) => !acc.isChecked).length,
          })
        } else {
          eventTracker('RLending_BankStatementLinkAccountFlow', {
            action: 'submit_clicked',
            auto_submit: false,
            screen: 'link_account_screen',
            bank_name: discoveredbank?.FIPName,
            count_of_accounts: discoveredbank?.AccountCount,
            count_of_selected_account: bankList.filter((acc: any) => acc.isChecked).length,
            count_of_deselected_account: bankList.filter((acc: any) => !acc.isChecked).length,
          })
        }
        let FIPDetailsList: FIPDetailsList[] = [];
        fiterCheckedAccount.forEach((account: any) => {
          FIPDetailsList.push({
            CUSTID: phoneNumber ? phoneNumber : decrypt?.mobile,
            FIPID: account.FIPID,
            FIPACCREFNUM: account.FIPACCREFNUM,
            LINKINGREFNUM: account.FIPACCLINKREF,
            LINKEDDATE: account.LINKEDDATE,
            FIPACCTYPE: account.FIPACCTYPE,
            FIPACCNUM: account.FIPACCNUM,
            FITYPE: account.FITYPE,
            CONSENTCOUNT: checkedBanks.length,
            CONSENTDATE: new Date(),
            LOGO: account?.LOGO || '',
            FIPNAME: account.FIPNAME || account.FIPNAME,
            FIPACCLINKREF: account.FIPACCLINKREF,
            isCardSelected: true,
          });
        });

        const consentBody: ConsentArtefactRequestBody = {
          I_MOBILENUMBER: phoneNumber ? phoneNumber : decrypt!.mobile,
          I_MPIN: '111111',
          I_BROWSER: browserName,
          I_ConsentHandle: decrypt?.srcref,
          FIPDetailsList: FIPDetailsList,
        };
        eventTracker('Rlending_AlmostThereScreen', {
          screen: 'almost_there_screen',
          action: 'almost_there_screen_shown'
        });
        setAnimateLoader(true)
        setTimeout(() => {
          setLoaderDrawer(true)
        }, 5000)
        const consentResponse = await ConsentArtefact(consentBody);
        if (consentResponse.RESULT_CODE === '200') {
          setAnimateLoader(false)
          navigate("/Success")
        } else {
          // FIXME: Confirm if the status should be REJECTED or ERROR. Also confirm if we should have the delay of 3 seconds.
          navigate("/Warning", { state: { phoneNumber: phoneNumber } })
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setAnimateLoader(false)
        navigate("/Success")
      } else {
        navigate("/Warning", { state: { phoneNumber: phoneNumber } })
      }
    }
  };

  const Ischecked = !!bankList ? bankList.filter((bank: any) => bank.isChecked) : [];

  const AccountEmpty = discoveredbank && discoveredbank.fip_DiscoverLinkedlist?.length === 0;

  const clearSession = () => {
    setSubmitlabel((prev) => `Confirm`);
    setInterval(() =>
      setTimeRemaining((timeRemaining) => (!!timeRemaining ? timeRemaining - timeRemaining : 0)),
      0);
    setIsAutosubmit(false);
  }

  const triggerTimer = () => {
    setInterval(() =>{
      setTimeRemaining((timeRemaining) => (!!timeRemaining ? timeRemaining - 1 : 0))
    },1000);
  };

  useEffect(() => {
      triggerTimer();
  }, [])

  useEffect(()=>{
    console.log(timeRemaining,isAutosubmit);
    if(isAutosubmit && timeRemaining > 0){
      setSubmitlabel((prev) => `Submitting in ${timeRemaining}s`);
    }else if(isAutosubmit && timeRemaining == 0){
      provideConsent();
    }
  },[timeRemaining])

  return (
    <>
      {!animateLoader && <Grid
        item
        container
        component={'main'}
        sx={{
          backgroundColor: '#272239',
          // border:'solid green',
          //padding:'20px 0px'
        }}
      >
       <Header label="Confirm your Bank" clearSession={clearSession} errorCount={errorCount} />
        <Grid component={'section'} sx={{ width: '100%' }}>
          <Box
            sx={{
              padding: submitlabel == 'Confirm bank account' ? '0px 16px 110px 16px' : '0px 16px 142px 16px',
              overflowY: 'scroll',
              height: 'auto',
              '::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              position: 'relative',
            }}
          >
              <Box sx={{ paddingTop: '24px' }}>
                <CardMedia
                  component="img"
                  src="/images/bank 1.svg"
                  alt="icon"
                  sx={{ maxHeight: '72px', width: '72px', display: 'inline' }}
                />
              </Box>
                <Box>
                <Typography
                    sx={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 700,
                      fontFamily: "Inter",
                      lineHeight: '28px',
                      paddingBottom: '4px',
                      fontStyle: 'normal'
                    }}
                  >Confirm your bank account</Typography>
                </Box>
                  <Box>
                    {bankList?.length > 0 &&
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 400,
                          fontFamily: "Inter",
                          color: '#D5CDF2',
                          paddingBottom: '16px',
                          lineHeight: '20px',
                          fontStyle: 'normal'
                        }}
                      >
                        The following bank account is linked with your number
                        {' '}
                        <span className='span-style'>
                          +91<span className='hyphen-style'>0</span>XXXXX-
                          {phoneNumber
                            ? phoneNumber.substring(5)
                            : decrypt?.mobile.substring(5) || (
                              <Skeleton
                                animation="wave"
                                sx={{
                                  ml: 1,
                                }}
                                width={100}
                              />
                            )}
                        </span>
                      </Typography> }
                  </Box> 
  
                    <Box sx={{ paddingTop: '4px' }}>
                      <BankCard
                        discovered={bankList}
                        linked={linkedAccounts}
                        checkedBanks={checkedBanks}
                        onAddBank={onAddBank}
                      />
                    </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ paddingTop: '6px' }}>
                          <CardMedia
                            component="img"
                            src="/images/question mark.svg"
                            alt="icon"
                            sx={{
                              display: 'inline',
                            }}
                          />
                        </Box>
                        <Typography>
                          <Button
                            variant="text"
                            disableRipple
                            style={{
                              textDecorationColor: '#D5CDF2',
                            }}
                            sx={{
                              color: '#D5CDF2',
                              textTransform: 'none',
                              fontSize: '12px',
                              textDecoration: 'underline',
                              fontStyle: 'normal',
                              fontWeight: 600,
                              lineHeight: '20px',
                              textUnderlineOffset: '2.5px',
                              '&:hover': {
                                backgroundColor: '#272239',
                                textDecoration: 'underline',
                              },
                            }}
                            onClick={() => {
                              setConsentDrawer(true);
                              eventTracker('RLending_BankStatementLinkAccountFlow', {
                                action: 'what_you_share_clicked',
                                screen: 'link_account_screen',
                                bank_name: discoveredbank?.FIPName,
                                count_of_accounts: discoveredbank?.AccountCount
                              })
                            }}
                          >
                            What you share with us?
                          </Button>
                        </Typography>
                      </Box>
                      </Box>
            <Grid
              container
              sx={{
                textAlign: 'center',
                backgroundColor: '#272239',
                // borderTop: '1px solid #3C3357',
                position: 'fixed',
                bottom: '0px',
                // paddingBottom: checkedAccountsNonLinked.length ? '16px' : '16px'
              }}
            >
              {bankList?.length > 0 && <Box className='bottom-animation'
                sx={{
                  width: '100%',
                  backgroundColor: '#272239',
                  margin: '0px 16px 16px 16px',
                }}
              >
                <Box
                  sx={{
                    margin: 'auto',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    sx={{ padding: '8px 0px', lineHeight: '14px', fontSize: '10px', fontFamily: 'Inter', color: '#FFFFFF' }}>
                    Powered by RBI regulated Account Aggregator
                    <span className='icon_powerby'><CardMedia
                      component="img"
                      src="/images/poweredBy.svg"
                      alt="icon"
                      sx={{ maxHeight: '60px', width: 'unset', display: 'inline' }}
                    /></span>
                  </Typography>
                </Box>
                <Box>
                  <Box>
                    <LoadingButton
                      className={submitlabel != 'Confirm'?'progress':''}
                      sx={{
                        color: 'white',
                        backgroundColor: '#6637E4',
                        overflow: 'hidden',
                        width: '100%',
                        height: '56px',
                        margin: 'auto',
                        borderRadius: '12px',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '100%',
                        // boxShadow: 'inset 0px 1px 0px 0px #846FC0',
                        // boxShadow: 'inset 0px 1px 0px 0px #846FC0',
                        borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.20)',
                        // border: '2px solid #846FC0',
                        // borderBottomColor: 'transparent !important',
                        '&:hover': {
                          backgroundColor: '#6637E4',
                          // boxShadow: 'inset 0px 1px 0px 1.2px #846FC0'
                        },
                        '&:disabled': {
                          opacity: '50%',
                          color: '#FFF',
                        },
                        textTransform: 'none',
                        // boxShadow: 'inset 0px 1px 0px 0px #846FC0',

                      }}
                      onClick={() => {
                     provideConsent()}}
                    >
                      {submitlabel}
                    </LoadingButton>
                    {submitlabel == 'Confirm' ?
                        <Box sx={{ width: '100%', margin: 'auto' }}>
                          <Typography>
                            <Button
                              variant="text"
                              disableRipple
                              style={{
                                textDecorationColor: '#D5CDF2',
                              }}
                              sx={{
                                color: '#D5CDF2',
                                textTransform: 'none',
                                textDecoration: 'underline',
                                lineHeight: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                fontFamily: 'Inter',
                                padding: '10px 8px 4px 8px',
                                textUnderlineOffset: '2.5px',
                                '&:disabled': {
                                  opacity: '50%',
                                  color: '#FFF',
                                },
                                '&:hover': {
                                  backgroundColor: '#272239',
                                  textDecoration: 'underline',
                                }
                              }}
                              onClick={() => {
                                setDetailsDrawer(true)
                                eventTracker('RLending_BankStatementLinkAccountFlow', {
                                  action: 'decline_clicked',
                                  screen: 'link_account_screen',
                                  bank_name: discoveredbank?.FIPName,
                                  count_of_accounts: discoveredbank?.AccountCount,
                                  count_of_selected_accounts: bankList.filter((acc: any) => acc.isChecked).length,
                                  count_of_deselected_accounts: bankList.filter((acc: any) => !acc.isChecked).length
                                })
                              }}
                            >
                              Decline
                            </Button>
                          </Typography>
                        </Box> : submitlabel.includes('Submitting') &&
                        <Box sx={{ width: '100%', margin: 'auto' }}>
                          <Typography>
                            <Button
                              variant="text"
                              disableRipple
                              style={{
                                textDecorationColor: '#D5CDF2',
                              }}
                              sx={{
                                color: '#D5CDF2',
                                textTransform: 'none',
                                textDecoration: 'underline',
                                lineHeight: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                fontFamily: 'Inter',
                                padding: '10px 8px 4px 8px',
                                textUnderlineOffset: '2.5px',
                                '&:disabled': {
                                  opacity: '50%',
                                  color: '#FFF',
                                },
                                '&:hover': {
                                  backgroundColor: '#272239',
                                  textDecoration: 'underline',
                                }
                              }}
                              disabled={AccountEmpty || !Ischecked.length}
                              onClick={() => {
                                clearSession()
                                eventTracker('RLending_BankStatementLinkAccountFlow', {
                                  action: 'cancel_clicked',
                                  screen: 'link_account_screen',
                                  bank_name: discoveredbank?.FIPName,
                                  count_of_accounts: bankList.length,
                                  count_of_selected_accounts: bankList.filter((acc: any) => acc.isChecked).length,
                                  count_of_deselected_accounts: bankList.filter((acc: any) => !acc.isChecked).length
                                })
                              }}
                            >
                              Cancel
                            </Button>
                          </Typography>
                        </Box>}
                  </Box>
                </Box>
              </Box>}
            </Grid>
          {!!consumer && consumer?.length && (
            <ConsentDetailsDrawer
              consentDrawer={consentDrawer}
              setConsentDrawer={setConsentDrawer}
              consentDetails={consumer}
            />
          )}

          {bankList?.length > 0 ? (
            <ConfirmationBottomDrawer
              type={'reject'}
              confirm={confirm}
              setConfirm={setConfirm}
              message={'Are you sure you want to reject the consent?'}
              sentvalue={1}
            />
          ) : (
            <ConfirmationBottomDrawer
              confirm={confirm}
              type={'cancel'}
              setConfirm={setConfirm}
              message={'Are you sure you want to cancel?'}
              sentvalue={1}
            />
          )}
          <RedirectingModal
            info={loader1.info}
            moreInfo={loader1.moreInfo}
            subInfo={loader1.subInfo}
            opened={loader1.status}
          //setModal={(type: any) => setLoader({ ...loader1, status:true  })}
          />
          {detailsDrawer && <DetailsDrawer submitbtn={true} DetailsDrawer={detailsDrawer} setDetailsDrawer={setDetailsDrawer} showDecline={true} setLoad={setLoader1} load={loader1} />}
          </Grid>
          </Grid>}
      {animateLoader &&
        <div className="success-submit" >
          {/* top session */}
          <Box>
            <div className="submit-box">
              <LottieAnima lottieAnimation={images}></LottieAnima>
            </div>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px'
            }}>

              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20.0002 1.81787C30.0344 1.81787 38.182 9.9649 38.182 19.9997C38.182 30.0339 30.0344 38.1815 20.0002 38.1815C9.96539 38.1815 1.81836 30.0339 1.81836 19.9997C1.81836 9.9649 9.96539 1.81787 20.0002 1.81787Z" fill="#1EA787" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M29.5794 16.6367L18.5302 27.3036C18.0746 27.739 17.443 27.9389 16.8198 27.8449C16.1998 27.7533 15.6566 27.3813 15.347 26.8364L10.1594 21.152C9.6103 20.169 9.96204 18.9271 10.945 18.378C11.9279 17.829 12.7632 18.378 13.7189 19.1636L17.5939 22.5251L26.7445 13.6272C27.5589 12.8419 28.8557 12.8654 29.6411 13.6797C30.4265 14.4941 30.403 15.791 29.5886 16.5763L29.5794 16.6367Z" fill="white" />
              </svg>
              <Typography className='submit-title'>You’re almost there</Typography>
              <Typography className='submit-sub'>Please do not close this app or minimise it</Typography>
            </Box>
          </Box>
          {/* Top session end */}
          {/* do you know */}
          {loaderDrawer && <Box className="know-box">
            <div className="">
              <div className=" img-box">
                <CardMedia
                  component="img"
                  src="/images/doyouknow.svg"
                  alt="Do you know"
                />
              </div>
              <Typography className='box-head'>Do you know ?</Typography>

            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="328" height="2" viewBox="0 0 328 2" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.0023V0.0023H328V1.0023H0Z" fill="url(#paint0_radial_2957_2942)" />
              <defs>
                <radialGradient id="paint0_radial_2957_2942" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(164 0.5) rotate(90) scale(0.5 164)">
                  <stop stop-color="white" stop-opacity="0.42" />
                  <stop offset="1" stop-color="white" stop-opacity="0" />
                </radialGradient>
              </defs>
            </svg>
            <Typography className='box-sub'>Having a good credit score helps you secure a loan more conveniently</Typography>
          </Box>}
          {/* do you know end*/}

        </div>}
        </>
  );
}
