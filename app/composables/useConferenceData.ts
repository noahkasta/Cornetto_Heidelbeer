import conferenceData from '~~/data/conference_data.json'

export function useConferenceData() {
  return {
    conference: conferenceData.conference,
    sessions: conferenceData.sessions,
    speakers: conferenceData.speakers,
  }
}