import { LoadingButton } from '@mui/lab';
import {
  CardMedia,
  styled,
  Typography,
  Drawer,
  Button,
  Grid,
} from '@mui/material';
import { Box } from '@mui/material';
import { AuthState } from '../../store/types/login';
import {
  AlreadyLinkedAccountsList,
  ConsentArtefact,
  ConsentArtefactRequestBody,
  FipNewDiscoverelist,
  IndBank,
  LinkAccountRequestBody,
  LinkBankAccount,
} from '../../api/banks';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootStateType } from '../../store/reducers';
import { ConsentRejectRequestBody, rejectConsent } from '../../api/banks';
import { browserName, closeAndRedirect, eventTracker, logEvent } from '../../lib/helper';
import React, { useEffect, useState } from 'react';
import { ADD_SELECTED_BANK_LIST, BankState } from '../../store/types/bankListType';
import RedirectingModal from '../RedirectingModal/index';
import OtpDrawer from './OtpDrawer';
import "@fontsource/inter";
import FormSubmitButton from '../forms/FormSubmitButton';

const DividerWrapper = styled('div')({
  paddingTop: '20px',
  paddingBottom: '20px',
  display: 'inline-block',
  '&::before, &::after': {
    position: 'absolute',
    zIndex: -1,
    content: '""',
    top: 0,
    bottom: '50%',
    left: '35px',
    'border-top': 0,
    'border-left': '2px solid rgba(0, 0, 0, 0.12)',
    transform: 'translateY(2px)',
  },
  '&::after': {
    top: '50%',
    bottom: 0,
  },
});

function VerticalDividerItem({
  children,
  hideTop = false,
  hideBottom = false,
}: {
  children: any;
  hideTop?: boolean;
  hideBottom?: boolean;
}) {
  const sx1 = hideTop === true ? { '&::before': { display: 'none' } } : {};
  const sx2 = hideBottom === true ? { '&::after': { display: 'none' } } : {};
  return (
    <DividerWrapper sx={{ ...sx1, ...sx2 } as any}>
      <span>{children}</span>
    </DividerWrapper>
  );
}

export default function DetailsDrawer({
  errorCount,
  DetailsDrawer,
  setDetailsDrawer,
  showDecline,
  setLoad,
  load,
  submitbtn
}: {
  DetailsDrawer: boolean;
  setLoad: any;
  load: any;
  // eslint-disable-next-line no-unused-vars
  errorCount?: any;
  setDetailsDrawer: (value: boolean) => void;
  showDecline: boolean;
  submitbtn : boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bankList, discoverBankResponse } = useSelector<RootStateType, BankState>(
    (state) => state.bank,
  );
  const [isVerified, setIsVerified] = useState(false);
  const [otploader, setotpLoader] = useState(false);
  const [arraytostring, setArraytostring] = useState("");
  const [loader, setLoader] = React.useState({
    status: false,
    info: '',
    subInfo: '',
    moreInfo: '',
  });
  const [otpDrawer, setOtpDrawer] = useState(false);
  const [linkResponse, setLinkResponse] = useState<any>();
  // const [isVerified, setIsVerified] = useState(false);
  const { decrypt } = useSelector<RootStateType, AuthState>((state) => state.auth);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDetailsDrawer(DetailsDrawer);
    };

  const rejectConsentCall = async () => {
    setDetailsDrawer(false);
    setLoad({
      ...load,
      status: true,
    })
    setLoader({
      ...loader,
      status: true,
    });
    const rejectBody: ConsentRejectRequestBody = {
      I_MOBILENUMBER: decrypt!.mobile,
      I_BROWSER: browserName,
      I_ConsentId: decrypt?.srcref,
      I_STATUS: 'REJECTED',
    };
    const rejectResponse = await rejectConsent(rejectBody);
    if (rejectResponse) {
      setLoader({
        ...loader,
        status: false,
      });
      closeAndRedirect({
        parentStatusMessage: 'REJECTED',
        delay: true,
        decrypt,
        url: decrypt?.redirect,
      });
    }
  };

  const exitCall = async () => {
    setDetailsDrawer(false);
    setLoad({
      ...load,
      status: true,
    })
    setLoader({
      ...loader,
      status: true,
    });
    closeAndRedirect({
      parentStatusMessage: 'N',
      delay: true,
      decrypt,
      url: decrypt?.redirect,
    });
   // eventTracker('exit', { action: 'exit_tapped' })
  }

  useEffect(() => {
    if (!!bankList) {
      let Arraytostring: any = [];
      bankList.filter((account: any) => {
        if (account.Linked) {
          Arraytostring.push(account.FIPID);
        }
      });
      setArraytostring(Arraytostring.toString())
    }
  }, [bankList])

  const onLinkAndConsent = async () => {
    setDetailsDrawer(false)
    // setOtpDrawer(true);
    // setotpLoader(true);
    // // setLoad({
    // //   ...load,
    // //   status: true
    // // })
    // const handleBody: LinkAccountRequestBody = {
    //   I_MOBILENUMBER: decrypt.mobile,
    //   I_BROWSER: browserName,
    //   I_FIPID: bankList[0]?.FIPID,
    //   ACCOUNTS_TO_LINK: bankList
    //     .filter((checkedBank: any) => !checkedBank.LINKEDDATE && checkedBank.isChecked)
    //     .map((checkedBank: any) => {
    //       return {
    //         FIPACCNUM: checkedBank!.FIPACCNUM,
    //         FIPACCREFNUM: checkedBank.FIPACCREFNUM,
    //         FIPACCTYPE: checkedBank.FIPACCTYPE,
    //         //if FITYPE is blank then set it as DEPOSIT
    //         FIPTYPE: checkedBank.FITYPE ? checkedBank.FITYPE : 'DEPOSIT',
    //         FIPID: checkedBank.FIPID,
    //         Logo: (checkedBank as IndBank).Logo,
    //       };
    //     }),
    // };
    // const linkResponse = await LinkBankAccount(handleBody);

    // dispatch({
    //   type: ADD_SELECTED_BANK_LIST,
    //   body: bankList,
    //   number: decrypt?.mobile,
    // });
    // if (linkResponse.RESULT_CODE === '200') {
    //   setLinkResponse(linkResponse);
    //   setotpLoader(false);
    //   // setLoad({
    //   //   ...load,
    //   //   status: false
    //   // })
    //  // eventTracker('LinkingBankAccountFlowAction', { action: 'otp_bottom_sheet_launched', fip: decrypt?.fipid || '' })
    // }
  };

  const Ischecked = !!bankList ? bankList.filter((bank: any) => bank.isChecked) : [];

  const provideConsent = async (
    linkedAccounts: ((AlreadyLinkedAccountsList | FipNewDiscoverelist) & {
      Logo?: string;
      LOGO?: string;
      FIPNAME?: string;
    })[],
  ) => {
    setDetailsDrawer(false);
    setLoad({
      ...load,
      status: true,
    })
    setLoader({
      ...loader,
      status: true,
    });
    try {
      let FIPDetailsList: any = [];
      Ischecked.forEach((account: any) => {
        FIPDetailsList.push({
          CUSTID: decrypt?.mobile,
          FIPID: account.FIPID,
          FIPACCREFNUM: account.FIPACCREFNUM,
          LINKINGREFNUM: account.FIPACCLINKREF,
          LINKEDDATE: account.LINKEDDATE,
          FIPACCTYPE: account.FIPACCTYPE,
          FIPACCNUM: account.FIPACCNUM,
          FITYPE: account.FITYPE,
          CONSENTCOUNT: Ischecked.length,
          CONSENTDATE: new Date(),
          LOGO: account?.LOGO || '',
          FIPNAME: account.FIPNAME || account.FIPNAME,
          FIPACCLINKREF: account.FIPACCLINKREF,
          isCardSelected: true,
        });
      });

      const consentBody: ConsentArtefactRequestBody = {
        I_MOBILENUMBER: decrypt!.mobile,
        I_MPIN: '111111',
        I_BROWSER: browserName,
        I_ConsentHandle: decrypt?.srcref,
        FIPDetailsList: FIPDetailsList,
      };
      setLoader({
        ...loader,
        status: true,
        info: 'Processing your request',
        subInfo: 'It may take a few seconds.',
      });
      const consentResponse = await ConsentArtefact(consentBody);
      if (consentResponse.RESULT_CODE === '200') {
        setLoader({
          ...loader,
          status: false,
          info: '',
          moreInfo: '',
          subInfo: ``,
        });
        logEvent({
          category: 'Link Account Page',
          action: 'Provide Consent',
          label:
            'Unique Customer user_id/session id where customer clicks on Provide Consent button if no accounts are available for given mob no and only linked accounts are found',
          value: 1,
        });
        // closeAndRedirect({
        //   url: decrypt?.redirect,
        //   parentStatusMessage: 'ACCEPTED',
        //   decrypt,
        //   FIPDetailsList,
        // });
        navigate("/Success")
      } else {
        // FIXME: Confirm if the status should be REJECTED or ERROR. Also confirm if we should have the delay of 3 seconds.
        navigate("/Warning", {state: {phoneNumber: decrypt!.mobile}})
        // closeAndRedirect({
        //   parentStatusMessage: 'REJECTED',
        //   decrypt,
        //   url: decrypt?.redirect,
        // });
      }
    } catch (err) {
      console.error(err);
      // FIXME: Confirm if the status should be REJECTED or ERROR. Also confirm if we should have the delay of 3 seconds.
      closeAndRedirect({
        url: decrypt?.redirect,
        parentStatusMessage: 'REJECTED',
        decrypt,
      });
    }
  };

  return (
    <Grid>
      <Drawer
        anchor="bottom"
        open={DetailsDrawer}
        sx={{
          zIndex: (theme: any) => theme.zIndex.modal + 1,
          '& .MuiDrawer-paper': {
            bgcolor: 'transparent'
          }
        }}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '546px',
            backgroundColor: '#2E2942',
            borderRadius: '16px 16px 0 0',
          }}
        >
          <Box>
            <Box sx={{ height: '60px', margin: '0px 16px' }}>
              <Box sx={{ marginTop: '16px', alignItems: 'center', float: 'right' }}>
                <CardMedia
                  component="img"
                  src="/images/big cross.svg"
                  alt="icon"
                  sx={{ maxHeight: '24px', width: '24px', display: 'inline' }}
                  onClick={() => { setDetailsDrawer(false); 
                    // !!arraytostring ? 
                    // eventTracker('LinkingBADeclineBottomSheetFlowAction', { action: 'cross_icon_clicked', fip_linked: !!arraytostring ? arraytostring : 'None' }) :
                    //  eventTracker('LinkingBABackBottomSheetFlowAction', { action: 'cross_icon_clicked', fip_linked: !!arraytostring ? arraytostring : 'None' }) 
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ margin: '0px 16px' }}>
              <Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: '28px',
                      color: 'white',
                    }}
                  >
                    You are almost there
                  </Typography>
                  <CardMedia
                    component="img"
                    src="/images/tick mark.svg"
                    alt="icon"
                    sx={{
                      maxHeight: '20px',
                      width: '20px',
                      display: 'inline',
                      marginTop: 0.5,
                      marginLeft: 0.5,
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: '28px',
                      color: 'white',
                    }}
                  >
                    Get your credit line with JAR
                  </Typography>
                </Box>
              </Box>
              <Box sx={{
                '@media screen and (max-width: 300px)': {
                  overflow: 'auto',
                  height: '200px',

                },
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}>
                <Box
                  sx={{
                    marginTop: 3,
                    // height: '48px',
                    display: 'flex',
                  }}
                >
                  {/* <div style={{ width: '48px', height: '48px', backgroundColor: '#D9D9D9', borderRadius: '4px' }}>
                  {' '}
                </div> */}
                  <CardMedia
                    component="img"
                    src="/images/Lower_Interest_Rate.svg"
                    alt="icon"
                    sx={{
                      maxHeight: '48px',
                      width: '48px',
                    }}
                  />
                  <Box sx={{ paddingLeft: '10px' }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '18px',
                          color: 'white',
                          fontFamily: "Inter",
                          lineHeight: '26px',
                          fontWeight: 700,
                          display: 'flex',
                          flexWrap: 'wrap',
                        }}
                      >
                        Lower interest rates  <CardMedia
                          component="img"
                          src="/images/smiley.png"
                          alt="icon"
                          sx={{
                            maxHeight: '26px',
                            width: '26px',
                          }}
                        />
                      </Typography>

                    </Box>
                    <Box  >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#EEEAFF',
                          fontFamily: "Inter",
                          lineHeight: '20px',
                          fontWeight: 400,
                        }}
                      >
                        It's lower than what you expect
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    marginTop: 3,
                    // height: '48px',
                    display: 'flex',
                  }}
                >
                  {/* <div style={{ width: '48px', height: '48px', backgroundColor: '#D9D9D9', borderRadius: '4px' }}>
                  {' '}
                </div> */}
                  <CardMedia
                    component="img"
                    src="/images/Credit_Limit.svg"
                    alt="icon"
                    sx={{
                      maxHeight: '48px',
                      width: '48px',
                    }}
                  />
                  <Box sx={{ paddingLeft: '10px' }}>
                    <Box  >
                      <Typography
                        sx={{
                          fontSize: '18px',
                          color: 'white',
                          fontFamily: "Inter",
                          lineHeight: '26px',
                          fontWeight: 700,
                        }}
                      >
                        Get higher credit limits
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#EEEAFF',
                          fontFamily: "Inter",
                          lineHeight: '20px',
                          fontWeight: 400,
                        }}
                      >
                        Select from a range of up to 12 EMI plans
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    marginTop: 3,
                    // height: '48px',
                    display: 'flex',
                  }}
                >
                  {/* <div style={{ width: '48px', height: '48px', backgroundColor: '#D9D9D9', borderRadius: '4px' }}>
                  {' '}
                  
                </div> */}
                  <CardMedia
                    component="img"
                    src="/images/Credit_Profile.svg"
                    alt="icon"
                    sx={{
                      maxHeight: '48px',
                      width: '48px',
                    }}
                  />
                  <Box sx={{ paddingLeft: '10px' }}>
                    <Box >
                      <Typography
                        sx={{
                          fontSize: '18px',
                          color: 'white',
                          fontFamily: "Inter",
                          lineHeight: '26px',
                          fontWeight: 700,
                        }}
                      >
                        Improve your credit profile
                      </Typography>
                    </Box>
                    <Box >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#EEEAFF',
                          fontFamily: "Inter",
                          lineHeight: '20px',
                          fontWeight: 400,
                        }}
                      >
                        Pay on time and get rewarding benefits
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Grid
              container
              sx={{
                textAlign: 'center',
                backgroundColor: '#2E2942',
                // borderTop: '1px solid #3C3357',
                position: 'fixed',
                bottom: '0px',
                padding: '0px 16px 16px 16px',
                // border: 'solid red'
              }}
            >
              <Box sx={{
                //  bottom:'12px',
                //  width:'100%',
                //  marginTop: showDecline ? '80px' : '115px'
                width: '100%',
                // backgroundColor: '#2E2942',
                // paddingTop: '8px',
                // border: 'solid red',
                // position: 'fixed',
                // margin: '0px 16px',
                // bottom: '0',
              }}>
                <Box sx={{ width: '100%', margin: 'auto', paddingBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  <Typography
                    sx={{ lineHeight: '14px', fontSize: '10px', fontFamily: 'Inter', color: '#FFFFFF' }}>
                    Powered by RBI regulated Account Aggregator
                    <span className='icon_powerby'>
                      <CardMedia
                        component="img"
                        src="/images/poweredBy.svg"
                        alt="icon"
                        sx={{ maxHeight: '60px', width: 'unset', display: 'inline' }}
                      />
                    </span>
                  </Typography>
                </Box>
                {submitbtn ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Box sx={{ width: '100%' }}>
                      <FormSubmitButton
                        onClick={() => {
                          provideConsent(bankList);
                         // eventTracker('LinkingBADeclineBottomSheetFlowAction', { action: 'link_account_clicked', fip_linked: !!arraytostring ? arraytostring : 'None' })
                         eventTracker('RLending_BankStatementAlmostThereScreen',{
                          action: 'submit_clicked',
                          type: 'submit'
                       })
                        }}
                        disabled={Ischecked.length === 0 || errorCount >= 5}
                        label="Submit"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', }}>
                      <Box>
                        <Typography
                          sx={{
                            // paddingTop: '8px',
                          }}
                        >
                          {showDecline ? (
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
                                textUnderlineOffset: '2.5px',
                                lineHeight: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                fontFamily: 'Inter',
                                padding: '10px 8px 4px 8px',
                                '&:hover': {
                                  backgroundColor: '#2E2942',
                                  textDecoration: 'underline',
                                },
                              }}
                              onClick={() => { rejectConsentCall(); eventTracker('LinkingBADeclineBottomSheetFlowAction', { action: 'do_not_link_clicked', fip_linked: !!arraytostring ? arraytostring : 'None' }) }}
                            >
                              Decline
                            </Button>) :
                            (<Button
                              variant="text"
                              disableRipple
                              style={{
                                textDecorationColor: '#D5CDF2',
                              }}
                              sx={{
                                color: '#D5CDF2',
                                textTransform: 'none',
                                textDecoration: 'underline',
                                textUnderlineOffset: '2.5px',
                                lineHeight: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                fontFamily: 'Inter',
                                '&:hover': {
                                  backgroundColor: '#2E2942',
                                  textDecoration: 'underline',
                                },
                              }}
                              onClick={() => {
                                eventTracker('RLending_BankStatementAlmostThereScreen',{
                                  action: 'exit_clicked',
                               })
                                exitCall()
                              }}
                            >
                              Exit
                            </Button>)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Box sx={{ width: '100%', margin: 'auto', }}>
                      <FormSubmitButton
                        // sx={{
                        //   color: 'white',
                        //   backgroundColor: '#6637E4',
                        //   width: '100%',
                        //   height: '56px',
                        //   borderRadius: '12px',
                        //   '&:hover': {
                        //     backgroundColor: '#6637E4',
                        //     boxShadow: 'none',
                        //   },
                        //   textTransform:'none'
                        // }}
                        onClick={() => {
                          onLinkAndConsent(); 
                          //eventTracker('LinkingBABackBottomSheetFlowAction', { action: 'link_account_clicked', fip_linked: arraytostring })
                          eventTracker('RLending_BankStatementAlmostThereScreen',{
                            action: 'link_account_clicked',
                            type: 'link'
                         })
                        }}
                        disabled={bankList?.every((acc: any) => !acc.isChecked) || errorCount >= 5}
                        label="Link your account"
                      />
                    </Box>
                    <Box sx={{ alignItems: 'center', paddingTop: '8px', }}>
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
                            textUnderlineOffset: '2.5px',
                            lineHeight: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            fontFamily: 'Inter',
                            '&:hover': {
                              backgroundColor: '#2E2942',
                              textDecoration: 'underline',
                            },
                          }}
                          disabled={Ischecked.length === 0}
                          onClick={() => { 
                            rejectConsentCall(); 
                            //eventTracker('LinkingBABackBottomSheetFlowAction', { action: 'do_not_link_clicked', fip_linked: arraytostring }) 
                            eventTracker('RLending_BankStatementAlmostThereScreen',{
                              action: 'dont_link_account_clicked',
                              type: 'link'
                           })
                          }}
                        >
                          I don't want to link account
                        </Button>
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Box>
        </Box>
      </Drawer>
      {loader.status && 
      <RedirectingModal 
      opened={loader.status} 
      info={loader.info}
      moreInfo={loader.moreInfo}
      subInfo={loader.subInfo}
      />}
      {/* { loader.status &&  
      <div className="loader-container">
          <CardMedia
            component="img"
            src="images/loader.gif"
            alt="icon"
            sx={{ height: '70px', width: '70px', borderRadius: '50%', display: 'inline' }}
          />
        </div>
        } */}
      <OtpDrawer
        flag={otpDrawer}
        loaderFlag={otploader}
        setotpLoader={setotpLoader}
        setFlag={setOtpDrawer}
        checkedBank={bankList}
        linkResponse={linkResponse}
        phoneNumber={decrypt?.mobile ? decrypt?.mobile : ''}
        RefNumber={linkResponse?.RefNumber}
        selectedFIP={bankList ? bankList[0]?.FIPID : ''}
        isVerified={isVerified}
        setIsVerified={setIsVerified}
        discoveredBank={discoverBankResponse}
      />
    </Grid>
  );
}