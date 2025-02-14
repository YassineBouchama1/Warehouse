// import { useEffect } from 'react';
// // import NetInfo from '@react-native-community/netinfo';
// import { onlineManager } from '@tanstack/react-query';

// /**
//  * Enables React Query to automatically refetch data when the app reconnects to the internet.
//  */
// export default function useOnlineManager() {
//   useEffect(() => {
//     // Set up an event listener for network connectivity changes
//     return NetInfo.addEventListener((state) => {
//       // Update React Query's online status based on network connectivity
//       onlineManager.setOnline(!!state.isConnected);
//     });
//   }, []);
// }
