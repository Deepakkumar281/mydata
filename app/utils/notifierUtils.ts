import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';

export const onGenerel = () => {
  Notifier.showNotification({
    title: 'John Doe',
    description: 'Hello! Can you help me with notifications?',
    duration: 0,
    showAnimationDuration: 800,
    showEasing: Easing.bounce,
    onHidden: () => console.log('Hidden'),
    onPress: () => console.log('Press'),
    hideOnPress: false,
  });
};

export const onAlert = () => {
  Notifier.showNotification({
    title: 'The request was failed',
    description: 'Check your internet connection, please',
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'error',
    },
  });
};

export const onWarning = () => {
  Notifier.showNotification({
    title: 'Warning..!',
    description: 'Please enter all details.',
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'warn',
    },
  });
};

export const onSuccess = () => {
  Notifier.showNotification({
    title: 'Success..!',
    description: 'Your profile information submitted successfully',
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'success',
    },
  });
};
