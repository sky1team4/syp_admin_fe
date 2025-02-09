// src/redux/selectors/fieldOfStudySelectors.js
import { createSelector } from 'reselect';

// Input selector to get the field of study items from the state
const selectFieldOfStudy = (state) => state.fieldofstudy.items;

// Memoized selector to return the field of study items
export const selectMemoizedFieldOfStudy = createSelector(
    [selectFieldOfStudy],
    (fieldOfStudies) => fieldOfStudies // Returns the same reference if fieldOfStudies hasn't changed
);