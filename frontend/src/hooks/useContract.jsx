import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccount } from '../context/AccountContext';
import {
  createStripeCheckoutSession,
  processStripeRedirect,
  getUserContracts,
  createRenewalStripeCheckoutSession
} from '../services/MembershipService';
import {
  CONTRACT_TABS,
  CONTRACT_MESSAGES,
  URL_PARAMS,
  PAYMENT_STATUSES
} from '../config/constants';

export const useContract = () => {
  const { account } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMembership, setSelectedMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(CONTRACT_TABS.CONTRACTS);
  const [processingRedirect, setProcessingRedirect] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hasActiveContract, setHasActiveContract] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);
  const [contractId, setContractId] = useState(null);

  useEffect(() => {
    if (!account) return;

    const query = new URLSearchParams(location.search);
    if ((query.get(URL_PARAMS.SUCCESS) || query.get(URL_PARAMS.CANCELED)) && !processingRedirect) {
      setProcessingRedirect(true);
      setIsRenewal(query.get(URL_PARAMS.RENEWAL) === 'true');
      if (query.get(URL_PARAMS.CONTRACT_ID)) {
        setContractId(query.get(URL_PARAMS.CONTRACT_ID));
      }
      handleStripeRedirect(query);
    }
  }, [location, account, processingRedirect]);

  useEffect(() => {
    const checkActiveContract = async () => {
      try {
        const contract = await getUserContracts();
        setHasActiveContract(!!contract);
        setCurrentContract(contract);
      } catch (err) {
        setError(CONTRACT_MESSAGES.CONNECTION_ERROR + err.message);
      }
    };

    if (account) {
      checkActiveContract();
    }
  }, [account, success]);

  useEffect(() => {
    if (!account) {
      navigate('/login');
    }
  }, [account, navigate]);

  const handleStripeRedirect = async (query) => {
    if (!account) return;

    try {
      setLoading(true);
      setError(null);
      const queryParams = {};

      for (const [key, value] of query.entries()) {
        queryParams[key] = value;
      }

      const isSuccess = query.get(URL_PARAMS.SUCCESS) === PAYMENT_STATUSES.SUCCESS;
      setPaymentSuccess(isSuccess);

      if (isSuccess) {
        const result = await processStripeRedirect(queryParams);

        if (result.success) {
          setShowPaymentModal(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setError(result.message || CONTRACT_MESSAGES.PAYMENT_PROCESS_ERROR);
          setShowPaymentModal(true);
        }
      } else {
        setShowPaymentModal(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      setError(CONTRACT_MESSAGES.PAYMENT_PROCESS_ERROR);
      setShowPaymentModal(true);
    } finally {
      setLoading(false);
      setProcessingRedirect(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setActiveTab(CONTRACT_TABS.CONTRACTS);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleMembershipSelect = (membership) => {
    setSelectedMembership(membership);
    setActiveTab(CONTRACT_TABS.PAYMENT);
  };

  const handleRenewalContract = async (contract) => {
    if (!contract || !contract.id) {
      setError(CONTRACT_MESSAGES.CONTRACT_INFO_ERROR);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      setCurrentContract(contract);
      setIsRenewal(true);

      const response = await createRenewalStripeCheckoutSession(contract.id);

      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        setError(response.message || CONTRACT_MESSAGES.RENEWAL_SESSION_ERROR);
      }
    } catch (err) {
      setError(`${CONTRACT_MESSAGES.CONNECTION_ERROR}${err.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMembership) {
      setError(CONTRACT_MESSAGES.SELECT_MEMBERSHIP);
      return;
    }

    handleStripeCheckout();
  };

  const handleStripeCheckout = async () => {
    if (!selectedMembership) {
      setError(CONTRACT_MESSAGES.SELECT_MEMBERSHIP);
      return;
    }

    if (!account) {
      setError(CONTRACT_MESSAGES.NO_USER_INFO);
      navigate('/login');
      return;
    }

    if (!selectedMembership.id) {
      setError(CONTRACT_MESSAGES.NO_MEMBERSHIP_ID);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await createStripeCheckoutSession(
        parseInt(selectedMembership.id)
      );

      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        setError(response.message || CONTRACT_MESSAGES.STRIPE_SESSION_ERROR);
      }
    } catch (err) {
      setError(`${CONTRACT_MESSAGES.CONNECTION_ERROR}${err.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/usuario');
  };

  const handleNewMembership = () => {
    setActiveTab(CONTRACT_TABS.MEMBERSHIPS);
  };

  return {
    // States
    selectedMembership,
    loading,
    error,
    success,
    activeTab,
    showPaymentModal,
    paymentSuccess,
    hasActiveContract,
    isRenewal,
    currentContract,

    // Methods
    setActiveTab,
    closePaymentModal,
    handleMembershipSelect,
    handleRenewalContract,
    handleSubmit,
    handleGoBack,
    handleNewMembership
  };
};

export default useContract;