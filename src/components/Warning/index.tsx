import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    CardMedia,
    Checkbox,
    Grid,
    Typography,
    Button
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConsentArtefact, ConsentArtefactRequestBody, FipNewDiscoverelist } from '../../api/banks';
import { useSelector } from 'react-redux';
import { RootStateType } from '../../store/reducers';
import { BankState } from '../../store/types/bankListType';
import { browserName, closeAndRedirect, eventTracker, logEvent } from '../../lib/helper';
import { useEffect, useState } from 'react';
import { AuthState } from '../../store/types/login';
import RedirectingModal from '../RedirectingModal';
export default function Warning() {
    const location = useLocation();
    const navigate = useNavigate();
    const { bankList, consumer } = useSelector<RootStateType, BankState>(
        (state) => state.bank,
      );
    const { decrypt, userData } = useSelector<RootStateType, AuthState>(
        (state) => state.auth,
      );
    const phoneNumber: any = (location.state as any)?.phoneNumber;
    const [failedcount,setFailedcount] = useState(1);
    const [loader, setLoader] = useState({
        status: false,
        info: '',
        subInfo: '',
        moreInfo: '',
      });

      useEffect(() =>{
        if(failedcount > 1){
          eventTracker('Rlending_ErrorScreenShown', {  
            action: 'error_screen_shown',
            link_bank_manually_enabled:'True'});
        }else{
          eventTracker('Rlending_ErrorScreenShown', {  
            action: 'error_screen_shown',
            link_bank_manually_enabled:'False'});
        }
      },[failedcount])

      const homeScreen = () => {
        eventTracker('Rlending_ErrorScreenShown', {  
          action: 'go_to_homescreen_clicked'});
        closeAndRedirect({
          parentStatusMessage: 'N',
          delay: true,
          decrypt,
          url: decrypt?.redirect,
        });
      }

    const provideConsent = async (
        linkedAccounts?: ((FipNewDiscoverelist) & {
          Logo?: string;
          LOGO?: string;
          FIPNAME?: string;
        })[],
      ) => {
        try {
          eventTracker('Rlending_ErrorScreenShown', {  
            action: 'try_again_clicked'});
          if (bankList.length > 0) {
            let fiterCheckedAccount = bankList.filter((x: any) => x.isChecked);
            let FIPDetailsList: any = [];
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
                CONSENTCOUNT: fiterCheckedAccount?.length,
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
            setLoader({
              ...loader,
              status: true,
              info: 'Processing your request',
              subInfo: 'It may take a few seconds.',
            });
            const consentResponse = await ConsentArtefact(consentBody);
            if (consentResponse.RESULT_CODE === '200') {
              navigate("/Success")
              // setLoader1({
              //   ...loader1,
              //   status: true,
              //   info: '',
              //   moreInfo: '',
              //   subInfo: ``,
              // });
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
            } else {
              // FIXME: Confirm if the status should be REJECTED or ERROR. Also confirm if we should have the delay of 3 seconds.
              setFailedcount((prev)=> {return failedcount+1});
              setLoader({
                ...loader,
                status: false,
                info: '',
                subInfo: '',
              });
            //   navigate("/Warning", {state: {failedcount : failedcount}})
              // closeAndRedirect({
              //   parentStatusMessage: 'REJECTED',
              //   decrypt,
              //   url: decrypt?.redirect,
              // });
            }
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
        <div className="warning-page ">
            {/* Warning page */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.81543 43.9909C4.81543 22.3408 22.3669 4.78931 44.0178 4.78931C65.6688 4.78931 83.2202 22.3408 83.2202 43.9909C83.2202 65.6419 65.6688 83.1933 44.0178 83.1933C22.3669 83.1933 4.81543 65.6419 4.81543 43.9909ZM44.0178 3.78931C21.8146 3.78931 3.81543 21.7885 3.81543 43.9909C3.81543 66.1942 21.8146 84.1933 44.0178 84.1933C66.221 84.1933 84.2202 66.1942 84.2202 43.9909C84.2202 21.7885 66.221 3.78931 44.0178 3.78931ZM80.9701 43.991C80.9701 23.5833 64.4255 7.03861 44.0177 7.03861C23.6093 7.03861 7.06535 23.5833 7.06535 43.991C7.06535 64.3995 23.6093 80.9434 44.0177 80.9434C64.4255 80.9434 80.9701 64.3995 80.9701 43.991Z" fill="#FF453A" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M40.267 49.6101C40.267 51.6815 41.9463 53.3609 44.0178 53.3609C46.0892 53.3609 47.7685 51.6815 47.7685 49.6101V26.5476C47.7685 24.4762 46.0892 22.7969 44.0178 22.7969C41.9463 22.7969 40.267 24.4762 40.267 26.5476V49.6101ZM39.8496 61.1354C39.8496 63.4375 41.7157 65.3036 44.0178 65.3036C46.3198 65.3036 48.1859 63.4375 48.1859 61.1354C48.1859 58.8341 46.3198 56.968 44.0178 56.968C41.7157 56.968 39.8496 58.8341 39.8496 61.1354Z" fill="white" />
                    </svg>
                    <Typography>Due to some technical error,
                        we could not connect your account</Typography>
                </Box>
                <div className="try-btn">

                    <Button
                        variant="text"
                        onClick={()=>{
                            provideConsent()
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            </Box>
            <Button className='back-btn' onClick={()=>{homeScreen()}}>
                Go to homescreen
            </Button>
            {/* Warnig page */}

            {/* Warning Attempts */}
           {failedcount > 1 && <div className="warning-attemp">
                <Typography>OR</Typography>
                <Button onClick={()=> {eventTracker('Rlending_ErrorScreenShown', {
                                action: 'link_bank_manually_clicked',
                                link_bank_manually_enabled :'True'
                              })}}>
                    <CardMedia 
                    component="img"
                    alt="pdf"
                    src='/images/pdf.svg'/>
                    Link bank manually</Button>
            </div>}
            {/* Warning Attempts end*/}

            <RedirectingModal
            info={loader.info}
            moreInfo={loader.moreInfo}
            subInfo={loader.subInfo}
            opened={loader.status}
          setModal={(type: any) => setLoader({ ...loader, status:true  })}
          />
        </div>

    );
}