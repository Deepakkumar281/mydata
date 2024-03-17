export const SET_COMPCODE_UPDATED = 'set_compcode_updated';

export interface SetScreenUpdated {
    type: typeof SET_COMPCODE_UPDATED,
    compcode: string
}

export const setCompcodeUpdated = (compcode: string) => ({
    type: SET_COMPCODE_UPDATED,
    compcode
});