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
import images from '../../../public/images/shimmer.json'
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

function AccountCard({
  account,
  accountNo,
  accountType,
  checked,
  onChange,
  
  linked = false,
  Logo,
  accountName,
}: {
  account: any;
  accountNo: string;
  accountType: string;
  checked: boolean;
  linked: any;
  
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
          
          marginBottom: '12px',
          padding: '16px',
          backgroundColor: bankList.length > 1 ? checked ? '#3C3357' : "#272239" : "#2E2942",
          border: bankList.length > 1 ? checked ? '1px solid #C5B0FF' : "1px solid #776E94" : "none",
          width: '100%',
          
          position: 'relative',
          gap: '12px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            
            display: 'flex',
            
            alignItems: 'center',
            
          }}
        >
          <Box
            sx={{ display: 'flex' }}>
            <img
              style={{
                width: '28px',
                height: '28px',
                
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
              
            }}>
            {accountType[0].toUpperCase() +
              accountType.substring(1).toLowerCase() +
              ' a/c: ' + accNo
            }
          </Typography>
          {linked && minutesDifference > 1 ? (
          <Box
            sx={{
              
              display: 'flex',
              
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
                
              }}
            >
              Your account is already linked
            </Typography>
          </Box>
        ) : linked && minutesDifference <= 1 ? (
          <Box
            sx={{
              
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
                
                marginTop: 1,
                
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
export default function LinkAccount() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [stopbar, setStopbar] = useState(false);
  const [animate, setAnimate] = useState("");
  const [btmanimate, setbtmAnimate] = useState("");
  const waitTime = 10;

  const [discoveredbank, setDiscoveredBank] = useState<discoverBanksResponseBody>();

  const [linkedAccounts, setLinkedAccounts] = useState<LinkDescResponseBody>();
  const { authBanks } = useSelector<RootStateType, AuthBankState>(
    (state) => state.authBanks,
  );
  
  const [consentHandleData, setConsentHandle] = useState<any>({});
  const [isVerified, setIsVerified] = useState(false);
  const [isAutosubmit, setIsAutosubmit] = useState(true);
  
  const dispatch = useDispatch();

  const [confirm, setConfirm] = useState(false);

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
  const [timeRemaining, setTimeRemaining] = useState<number>(waitTime + 1);
  const [tryAgain, setTryAgain] = useState(false);
  const [detailsDrawer, setDetailsDrawer] = useState(false);
  const [otploader, setotpLoader] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [loaderDrawer, setLoaderDrawer] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const { decrypt, addNumberFlow } = useSelector<RootStateType, AuthState>(
    (state) => state.auth,
  );
  
  const { bankList, consumer } = useSelector<RootStateType, BankState>(
    (state) => state.bank,
  );

  const [checkedBanks, setCheckedBanks] = useState<FipNewDiscoverelist[]>([]);
  const [submitlabel, setSubmitlabel] = useState("");
  const prevlabelRef = useRef<any>("");
  
  const selectedFips: bankDetail = (location.state as any)?.choosedBank;
  
  const phoneNumber: string | null = (location.state as any)?.phoneNumber;

  const triggerTimer = () => {
    setInterval(() =>
      setTimeRemaining((timeRemaining) => (!!timeRemaining ? timeRemaining - 1 : 0)),
      1000);
  };

  useEffect(() => {
    setAnimate("connect");
    setIsVerified(false);
    
    setLoader(true);
    async function callApi(discoverBanksRequestBody: discoverBanksRequestBody) {
      try {
        const discoverBankResponse = await discoverBanks(discoverBanksRequestBody);
        if (discoverBankResponse) {
          setStopbar(true);
          setProgress((oldProgress) => {
            return 100;
          });
          setDiscoveredBank(discoverBankResponse);
          var fip_discoverList = discoverBankResponse.fip_DiscoverLinkedlist.filter((acc: any) => acc.FIPID === decrypt.fipid)
          dispatch({
            type: DISCOVER_REPONSE,
            body: discoverBankResponse,
          });
          dispatch({
            type: BANK_LIST,
            body: fip_discoverList,
          });
          setCheckedBanks(fip_discoverList);
          if (!fip_discoverList.length) {
            eventTracker('RLending_BankStatementLinkAccountFlow', {
              action: 'account_screen_shown',
              screen: 'link_account_screen',
              bank_name: discoverBankResponse.FIPName,
              count_of_accounts: 0,
            })
          } else {
            eventTracker('RLending_BankStatementLinkAccountFlow', {
              action: 'link_account_screen_shown',
              screen: 'link_account_screen',
              bank_name: discoverBankResponse.FIPName,
              count_of_accounts: fip_discoverList.length,
              count_of_linked_accounts: fip_discoverList.filter((acc: any) => acc.Linked === true).length,
              count_of_unlinked_accounts: fip_discoverList.filter((acc: any) => acc.Linked === false).length,
              cta_enabled: Ischecked.length == 0 ? false : true
            })
          }
          
        }
      } catch (err) {
        console.error(err);
        setStopbar(true);
        setProgress((oldProgress) => {
          return 100;
        });
      } finally {
        setTimeout(() => {
          setLoader(false);
          setTimeRemaining(10)
        }, 2000);

      }
    }

    const discoverBanksRequestBody: discoverBanksRequestBody = {
      I_MOBILENUMBER: phoneNumber ? phoneNumber : decrypt!.mobile,
      I_BROWSER: browserName,
      I_FIPID: selectedFips ? selectedFips.FIPID : decrypt?.fipid || '',
      I_FIPNAME: selectedFips ? selectedFips.FIPNAME : decrypt?.fipid || '',
      I_Identifier: [
        {
          I_Flag: 'MOBILE',
          DATA: phoneNumber ? phoneNumber : decrypt!.mobile,
          type: 'STRONG',
        },
      ],
      I_FITYPE: decrypt?.fIType || '',
    };
    startprogress();
    callApi(discoverBanksRequestBody);
    callhandleDetailsAPI();
  }, [tryAgain]);

  const startprogress = () => {
    setAnimate("connect");
    eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'post_otp_loading_screen_shown', screen_text: 'Connecting to your bank', screen: 'post_otp_loading_screen' });
    setInterval(() => {
      if (!stopbar && progress < 80) {
        setProgress((oldProgress) => {
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 80);
        });
      } else {
        setProgress((oldProgress) => {
          return 100;
        });
      }
    }, 500);
    setTimeout(() => {
      setbtmAnimate('Enable')
    }, 1000)
    setTimeout(() => {
      eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'post_otp_loading_screen_shown', screen_text: 'Securing your information', screen: 'post_otp_loading_screen' });
      setAnimate("fetchbank");
    }, 2000);
    setTimeout(() => {
      eventTracker('RLending_BankStatementFirstOtpScreen', { action: 'post_otp_loading_screen_shown', screen_text: 'Customising your experience', screen: 'post_otp_loading_screen' });
      setAnimate("fetchacc");
    }, 4000);
  };

  const Ischecked = !!bankList ? bankList.filter((bank: any) => bank.isChecked) : [];

  const callhandleDetailsAPI = async () => {
    const handleBody: consentHandleDetailsRequestBody = {
      I_MOBILENUMBER: decrypt!.mobile,
      I_BROWSER: browserName,
      I_ConsentHandle: decrypt!.srcref || '',
    };
    const consentResponse = await consentHandle(handleBody);
    if (consentResponse.RESULT_CODE === '200') {
      dispatch({
        type: SET_CONSUMER_DETAILS,
        consumer_data: consentResponse.lst
      });
      setConsentHandle(consentResponse);
    }
  };

  const onAddBank = async (status: boolean, bank: any) => {
    if (status) {
      
      const selectedBanks: IndBank[] = [bank];
      setCheckedBanks(selectedBanks);
    } else {
      
      const selectedBanks = checkedBanks.filter(function (bank1) {
        return bank1.FIPACCREFNUM !== bank.FIPACCREFNUM;
      });
      setCheckedBanks(selectedBanks);
    }
  };

  useEffect(()=>{
  if(!!bankList){
    const checked = bankList.filter((acc:any)=> acc.isChecked && acc.Linked).length
    let submitButtonLabel = checked > 0  ? 'Confirm account' : 'Confirm account with OTP';
    setSubmitlabel((prev) => submitButtonLabel);
  }
  },[bankList])

  useEffect(() => {
    if (linkError || errorCount >= 5 && !loader) {
      eventTracker('RLending_BankStatementLinkAccountFlow', {
        action: 'otp_limit_exceeded_shown',
        screen: 'link_account_screen',
        bank_name: discoveredbank?.FIPName,
        count_of_accounts: discoveredbank?.AccountCount,
        count_of_linked_accounts: discoveredbank?.fip_DiscoverLinkedlist.filter((acc: any) => acc.Linked === true).length,
        count_of_selected_accounts: bankList?.filter((acc: any) => acc.isChecked === true).length,
        count_of_linked_selected_accounts: bankList?.filter((acc: any) => acc.isChecked && acc.Linked).length,
        count_of_unlinked_selected_accounts: bankList?.filter((acc: any) => acc.isChecked && !acc.Linked).length
      })
    }
  }, [errorCount, linkError, loader])

  const onLinkAndConsent = async (checkedAccount:any) => {
    setOtpDrawer(true);
    setotpLoader(true);
    eventTracker('RLending_BankStatementLinkAccountFlow', {
      action: 'confirm_account_with_otp_clicked',
      screen: 'link_account_screen',
      bank_name: discoveredbank?.FIPName,
      count_of_accounts: discoveredbank?.AccountCount,
      count_of_linked_accounts: discoveredbank?.fip_DiscoverLinkedlist.filter((acc: any) => acc.Linked === true).length,
      count_of_selected_accounts: bankList?.filter((acc: any) => acc.isChecked === true).length,
      count_of_linked_selected_accounts: bankList?.filter((acc: any) => acc.isChecked && acc.Linked).length,
      count_of_unlinked_selected_accounts: bankList?.filter((acc: any) => acc.isChecked && !acc.Linked).length
    })

    const handleBody: LinkAccountRequestBody = {
      I_MOBILENUMBER: phoneNumber ? phoneNumber : decrypt.mobile,
      I_BROWSER: browserName,
      I_FIPID: selectedFips ? selectedFips.FIPID : checkedBanks[0]?.FIPID,
      ACCOUNTS_TO_LINK: checkedAccount.map((checkedBank: any) => {
          return {
            FIPACCNUM: checkedBank!.FIPACCNUM,
            FIPACCREFNUM: checkedBank.FIPACCREFNUM,
            FIPACCTYPE: checkedBank.FIPACCTYPE,
            
            FIPTYPE: checkedBank.FITYPE ? checkedBank.FITYPE : 'DEPOSIT',
            FIPID: checkedBank.FIPID,
            Logo: (checkedBank as IndBank).Logo,
          };
        }),
    };
    const linkResponse = await LinkBankAccount(handleBody);
    setLinkResponse(linkResponse);
    if (linkResponse.RESULT_CODE === "200") {
      setInterval(() => {
        FetchOtp();
      }, 1500);
      eventTracker('RLending_BankStatementSecondOtpScreen', {
        action: 'otp_sent'
      })
      setLoader1({ ...loader1, status: false });
      dispatch({
        type: ADD_SELECTED_BANK_LIST,
        body: checkedBanks,
        number: phoneNumber ? phoneNumber : decrypt.mobile,
      });
      setotpLoader(false);
    } else {
      setLinkError(true)
      setotpLoader(false);
      setOtpDrawer(false)
    }
    
  };

  const LinkorSubmit = () =>{
    const checkedAccount = bankList.filter((acc:any)=> acc.isChecked);
    if(submitlabel == 'Confirm account'){
      dispatch({
        type: BANK_LIST,
        body: checkedAccount,
      });
      navigate("/Confirm")
    }else{
      onLinkAndConsent(checkedAccount);
    }

  }

  const isAccountsNotEmpty =
    (discoveredbank && discoveredbank.fip_DiscoverLinkedlist?.length > 0) ||
    (linkedAccounts && !!linkedAccounts.lst && linkedAccounts.lst.length > 0);

  const AccountEmpty = discoveredbank && discoveredbank.fip_DiscoverLinkedlist?.length === 0;

  useEffect(() => {
    
    if (isAccountsNotEmpty) {
      triggerTimer();
    }
  }, [isAccountsNotEmpty])

  return (
     <Grid
        item
        container
        component={'main'}
        sx={{
          backgroundColor: '#272239',
          
        }}
      >
        {stopbar && <Header label="Confirm your Bank" errorCount={errorCount} />}
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
            {stopbar && <Box>
              <Box sx={{ paddingTop: '24px' }}>
                <CardMedia
                  component="img"
                  src="/images/bank 1.svg"
                  alt="icon"
                  sx={{ maxHeight: '72px', width: '72px', display: 'inline' }}
                />
              </Box>
              <Box>
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
                  >
                Link your bank account
                  </Typography>

                </Box>
                {isAccountsNotEmpty ?
                  <Box>
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
                           {bankList?.length > 1 ? 'We have found these bank accounts with your number' :'We have found this bank account with your number'}
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
                      </Typography> 
                  </Box> : <Box>
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
                      We could not find bank account with your number {' '}
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
                    </Typography>
                  </Box>
                }
              </Box>
            </Box>}
            {!loader ? (
              <>
                {isAccountsNotEmpty ? (
                  <>
                    <Box sx={{ paddingTop: '4px' }}>
                      <BankCard
                        discovered={bankList}
                        linked={linkedAccounts}
                        checkedBanks={checkedBanks}
                        onAddBank={onAddBank}
                      />
                    </Box>
                    {linkError || errorCount >= 5 ?
                      <Typography
                        sx={{
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '18px',
                          color: '#EB6A6E'
                        }}
                      >
                        OTP limit has been exceeded after too many wrong attempts. Please try after 1 hour.
                      </Typography> :
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
                    }
                  </>
                ) : (
                  <Box>
                    <Box
                      sx={{
                        border: '1px solid #776E94',
                        borderRadius: '8px',
                        minHeight: '160px',
                        padding: '16px',
                      }}>
                      <Box
                        sx={{
                          bgcolor: '#272239',
                          paddingBottom: '12px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            
                          }}
                        >
                          <CardMedia
                            component="img"
                            src="/images/Bank.svg"
                            
                            sx={{ width: '24px', height: '24px' }}
                          />
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontStyle: 'normal',
                              fontWeight: 600,
                              lineHeight: '20px',
                              color: 'white',
                              display: "flex",
                              padding: '0px 8px'
                            }}>

                            {discoveredbank ?
                              discoveredbank.FIPName
                              : decrypt?.fipname || decrypt?.fipid}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <CardMedia
                          component="img"
                          src="/images/danger.svg"
                          alt="icon"
                          sx={{
                            maxHeight: '20px',
                            width: '20px',
                            display: 'inline',
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: "Inter",
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '18px',
                            color: '#C5B0FF',
                            paddingLeft: '3px',
                            fontStyle: 'normal',
                            padding: '0px 8px'
                          }}
                        >
                          Couldn't find account
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "Inter",
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: '18px',
                          color: 'white',
                          fontStyle: 'normal',
                          
                          margin: '10px 0'
                        }}
                      >
                        Try again if your number is registered with this bank. If issue
                        continues, server might be down.
                      </Typography>
                      <Box className="change-box"
                        sx={{ display: 'flex', justifyContent: 'end', gap: '20px' }} >
                        <Typography
                        >
                          <Button
                            className='change-nubmer'
                            variant="text"
                            disableRipple
                            onClick={() => {
                              navigate('/Add-mobile', {
                                state: { choosedBank: discoveredbank, phoneNumber },
                              });
                              
                              eventTracker('RLending_BankStatementLinkAccountFlow', {
                                action: 'change_number_clicked',
                                screen: 'link_account_screen',
                                bank_name: discoveredbank?.FIPName,
                                count_of_accounts: discoveredbank?.AccountCount,
                              })
                            }
                            }
                          >
                            Change Number
                          </Button>
                        </Typography>
                        <Typography

                        >
                          <Button
                            className='change-nubmer'
                            variant="text"
                            disableRipple

                            onClick={() => {
                              setTryAgain(true);
                              setLoader(true);
                              
                              eventTracker('RLending_BankStatementLinkAccountFlow', {
                                action: 'try_again_clicked',
                                screen: 'link_account_screen',
                                bank_name: discoveredbank?.FIPName,
                                count_of_accounts: discoveredbank?.AccountCount,
                              })
                            }}
                          >
                            Try Again
                          </Button>
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', paddingTop: '8px' }}>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <>

                {!stopbar && <Grid sx={{ height: '70vh', backgroundColor: '#272239', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '21px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <Box
                      sx={{

                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'

                      }}
                    >

                      <CardMedia
                        component="img"
                        src="/images/bank 1.svg"
                        alt="icon"
                        sx={{ height: '80px', width: '80px' }}
                      />

                      <Box className="positivity animation-text" sx={{ textAlign: 'center', width: '100%', margin: 0 }}>
                        <Typography className={`change ${animate == 'connect' ? 'flowin' : ''} ${animate == 'fetchbank' ? 'flowout' : ''}`}>Connecting to your bank</Typography>
                        <Typography className={`change ${animate == 'fetchbank' ? 'flowin' : ''} ${animate == 'fetchacc' ? 'flowout' : ''}`}>Securing your information</Typography>
                        <Typography className={`change ${animate == 'fetchacc' ? 'flowin' : ''} ${animate == 'connect' ? 'flowout' : ''}`}>Customising your experience</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%', backgroundColor: '#272239', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <LinearProgress sx={{
                        width: '212px', backgroundColor: '#3C3357', height: '12px', borderRadius: '16px', margin: 'auto',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#58DDC8'
                        }
                      }} variant="determinate" value={progress} />
                    </Box>
                    <Box className="positivity animation-text-btm" sx={{ textAlign: 'center', width: '100%', margin: 0 }}>
                      <Typography sx={{ transform: 'translateY(-20px)', color: '#D5CDF2', fontSize: '14px', fontWeight: '400' }} className={`change ${btmanimate == 'Enable' ? 'flowin' : ''}`}>It may take a few seconds.</Typography>
                    </Box>
                  </Box>
                </Grid>}

                {stopbar && <Box
                  sx={{
                    borderRadius: '8px',
                    marginBottom: 10,
                  }}
                >

           <LottieAnima lottieAnimation={images}></LottieAnima>
                </Box>}
              </>
            )}{' '}
          </Box>
          {linkError || errorCount >= 5 && !loader ?
            <Grid
              container
              sx={{
                textAlign: 'center',
                backgroundColor: '#272239',
                
                position: 'fixed',
                bottom: '0px',
                
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: '#272239',
                  
                  margin: '0px 16px 16px 16px',
                  bottom: '0',
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
                <div className="warning-attemp">
                  <Button sx={{ width: '100%' }}
                    onClick={() => {
                      setLoader1({
                        ...loader1,
                        status: true,
                        info: '',
                        moreInfo: '',
                        subInfo: ``,
                      })
                      closeAndRedirect({
                        parentStatusMessage: 'N',
                        delay: true,
                        decrypt,
                        url: decrypt?.redirect,
                      });
                      eventTracker('RLending_BankStatementLinkAccountFlow', {
                        action: 'otp_limit_exceeded_go_back_clicked',
                        screen: 'link_account_screen',
                        bank_name: discoveredbank?.FIPName,
                        count_of_accounts: discoveredbank?.AccountCount,
                        count_of_linked_accounts: discoveredbank?.fip_DiscoverLinkedlist.filter((acc: any) => acc.Linked === true).length,
                        count_of_selected_accounts: bankList?.filter((acc: any) => acc.isChecked === true).length,
                        count_of_linked_selected_accounts: bankList?.filter((acc: any) => acc.isChecked && acc.Linked).length,
                        count_of_unlinked_selected_accounts: bankList?.filter((acc: any) => acc.isChecked && !acc.Linked).length
                      })
                    }}>Go Back</Button>
                </div>
              </Box>
            </Grid> :
            <Grid
              container
              sx={{
                textAlign: 'center',
                backgroundColor: '#272239',
                
                position: 'fixed',
                bottom: '0px',
                
              }}
            >
              {bankList?.length > 0 && !loader && <Box className='bottom-animation'
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
                    <LoadingButton
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
                        
                        borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.20)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.20)',
                        
                        '&:hover': {
                          backgroundColor: '#6637E4',
                          
                        },
                        '&:disabled': {
                          opacity: '50%',
                          color: '#FFF',
                        },
                        textTransform: 'none',
                        
                      }}
                      onClick={() => {LinkorSubmit()}}
                      disabled={Ischecked.length == 0}
                    >
                      {submitlabel}
                    </LoadingButton>
                    {submitlabel == 'Confirm' &&
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
                              disabled={AccountEmpty || loader || !Ischecked.length}
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
                        </Box>}
                </Box>
              </Box>}
            </Grid>}
          {consentHandleData.lst && consentHandleData?.lst.length && (
            <ConsentDetailsDrawer
              consentDrawer={consentDrawer}
              setConsentDrawer={setConsentDrawer}
              consentDetails={consentHandleData?.lst}
            />
          )}

          {discoveredbank && discoveredbank.fip_DiscoverLinkedlist?.length > 0 ? (
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
          
          />
          {otpDrawer && (
            <OtpDrawer
              flag={otpDrawer}
              loaderFlag={otploader}
              setotpLoader={setotpLoader}
              setFlag={setOtpDrawer}
              checkedBank={checkedBanks}
              linkResponse={linkResponse}
              phoneNumber={phoneNumber ? phoneNumber : decrypt.mobile}
              RefNumber={linkResponse?.RefNumber}
              selectedFIP={selectedFips ? selectedFips.FIPID : checkedBanks[0]?.FIPID}
              isVerified={isVerified}
              setIsVerified={setIsVerified}
              discoveredBank={discoveredbank}
              errorCount={errorCount}
              setErrorCount={setErrorCount}
            />
          )}
          {detailsDrawer &&
            <DetailsDrawer submitbtn={false} DetailsDrawer={detailsDrawer} setDetailsDrawer={setDetailsDrawer} showDecline={true} setLoad={setLoader1} load={loader1} />}
        </Grid>
      </Grid>
  );
}
