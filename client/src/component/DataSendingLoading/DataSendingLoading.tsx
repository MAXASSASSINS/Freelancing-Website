import { BsCheckCircle } from "react-icons/bs";
import "./DataSendingLoading.css";

type DataSendingLoadingProps = {
  finishedLoading?: boolean;
  show: boolean;
  loadingText?: string;
  pos?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
};

export const DataSendingLoading = ({ finishedLoading, show, loadingText = '', pos = 'fixed' }: DataSendingLoadingProps) => {
  return (
    <div
      className="data-sending-loading-overlay"
      style={{ display: show ? "" : "none", position: pos}}
    >
      {!finishedLoading ? (
        <div>
          <p className="saving-your-gig">{loadingText}</p>
          <span className="data-sending-loader"></span>
        </div>
      ) : (
        <div className="finished-loading-wrapper">
          <p>Changes saved!</p>
          <span>
            <BsCheckCircle />
          </span>
        </div>
      )}
    </div>
  );
};
