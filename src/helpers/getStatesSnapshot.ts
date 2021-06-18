export const getStatesSnapshot = (mainAppStore: any) => {
    const allStates = {
        mainAppStore: {
            accounts: mainAppStore.accounts,
        },
        instrumentsStore: {
            activeInstruments: mainAppStore.rootStore.instrumentsStore.activeInstruments,
        },
        quotesStore: {
            activePositions: mainAppStore.rootStore.quotesStore.activePositions,
        },
        withdrawalStore: {
            history: mainAppStore.rootStore.withdrawalStore.history,
        }
    };
    return allStates;
};