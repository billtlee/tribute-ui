import {useSelector} from 'react-redux';

import {OffchainVotingStatus} from './voting';
import {ProposalData} from './types';
import {StoreState} from '../../store/types';
import {VotingAdapterName} from '../adapters-extensions/enums';

type ProposalCardProps = {
  buttonText?: string;
  onClick: (proposalOnClickId: string) => void;
  proposal: ProposalData;
  /**
   * The ID for the proposal to be used for navigation.
   * As there can be a few different options, it's best to provide it
   * explicitly.
   */
  proposalOnClickId: string;
  name: string;
};

const DEFAULT_BUTTON_TEXT: string = 'View Proposal';

/**
 * Shows a preview of a proposal's details
 *
 * @param {ProposalCardProps} props
 * @returns {JSX.Element}
 */
export default function ProposalCard(props: ProposalCardProps): JSX.Element {
  const {
    buttonText = DEFAULT_BUTTON_TEXT,
    proposal,
    proposalOnClickId,
    onClick,
    name,
  } = props;

  /**
   * Selectors
   */

  const votingAdapterName = useSelector(
    (s: StoreState) => s.contracts.VotingContract?.adapterOrExtensionName
  );

  /**
   * Functions
   */

  function handleClick() {
    onClick(proposalOnClickId);
  }

  /**
   * Change status component based on voting adapter.
   *
   * @todo It's currently not possible to get the voting adapter used for a DAO proposal,
   *   so until then we need to use the currently registered voting adapter for the DAO.
   */
  function renderStatus(proposal: ProposalData) {
    switch (votingAdapterName) {
      case VotingAdapterName.OffchainVotingContract:
        return <OffchainVotingStatus proposal={proposal} />;
      // @todo On-chain Voting
      // case VotingAdapterName.VotingContract:
      //   return <></>
      default:
        return <></>;
    }
  }

  /**
   * Render
   */

  return (
    <div className="proposalcard" onClick={handleClick}>
      {/* TITLE */}
      <h3 className="proposalcard__title">{name}</h3>

      {/* VOTING PROGRESS STATUS AND BAR */}
      {renderStatus(proposal)}

      {/* BUTTON (no click handler) */}
      <button className="proposalcard__button">
        {buttonText || DEFAULT_BUTTON_TEXT}
      </button>
    </div>
  );
}
