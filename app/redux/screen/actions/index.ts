export const SET_SCREEN_UPDATED = 'set_screen_updated';

export interface SetScreenUpdated {
    type: typeof SET_SCREEN_UPDATED,
    screenName: string
}

export const setScreenUpdated = (screenName: string) => ({
    type: SET_SCREEN_UPDATED,
    screenName
});