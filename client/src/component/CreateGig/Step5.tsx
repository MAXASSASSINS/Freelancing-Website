import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StepProps, StepRef } from "./CreateGig";
import { IFile } from "../../types/file.types";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { FileDropIcon, FileDropIconRef } from "../FileDropIcon/FileDropIcon";
import { uploadToCloudinaryV2 } from "../../utility/cloudinary";

const Step5 = ({ handleSendData }: StepProps, ref: React.Ref<StepRef>) => {
  const { gigDetail } = useSelector((state: RootState) => state.gigDetail);
  const [sellerShowcaseImages, setSellerShowcaseImages] = useState<
    (IFile | null)[]
  >([null, null, null]);
  const [sellerShowcaseVideo, setSellerShowcaseVideo] = useState<IFile | null>(
    null
  );
  const sellerShowcaseImagesRefs = useRef<React.RefObject<FileDropIconRef>[]>(
    Array.from({ length: 3 }, () => React.createRef<FileDropIconRef>())
  );

  const sellerShowcaseVideoRef = useRef<FileDropIconRef>(null);
  const [sellerShowcaseVideoError, setSellerShowcaseVideoError] = useState("");
  const [sellerShowcaseImagesError, setSellerShowcaseImagesError] =
    useState("");

  const checkForWarnings = () => {
    let foundOneImage = false;
    sellerShowcaseImages.forEach((item, index) => {
      if (item !== null) {
        foundOneImage = true;
      }
    });
    if (!foundOneImage) {
      setSellerShowcaseImagesError("Please upload at least one image");
      return true;
    }
    if (sellerShowcaseImagesError || sellerShowcaseVideoError) return true;
  };

  const handleSubmit = async () => {
    if (checkForWarnings()) {
      return false;
    }
    const images: IFile[] = [];
    sellerShowcaseImages.forEach((item, index) => {
      if (item) {
        images.push(item);
      }
    });
    console.log(images);
    console.log(sellerShowcaseVideo);
    const res1 = await uploadToCloudinaryV2(images);
    const res2 = await uploadToCloudinaryV2(
      sellerShowcaseVideo ? [sellerShowcaseVideo] : []
    );

    const media = {
      images: res1,
      video: res2[0] ? res2[0] : null,
    };

    setSellerShowcaseImages(res1);
    setSellerShowcaseVideo(res2[0]);
    const payload = { data: media, step: 5 };
    const res = await handleSendData(payload);
    return res || false;
  };

  const getSellerShowcaseVideo = (val: IFile) => {
    setSellerShowcaseVideoError("");
    setSellerShowcaseVideo(val);
  };

  const getSellerShowcaseImages = (val: IFile, index?: number) => {
    const newSellerShowcaseImages = sellerShowcaseImages.map((item, i) => {
      if (i === index) {
        return val;
      } else {
        return item;
      }
    });
    setSellerShowcaseImagesError("");
    setSellerShowcaseImages(newSellerShowcaseImages);
  };

  const getSellerShowcaseVideoError = (val: string) => {
    setSellerShowcaseVideoError(val);
  };

  const getSellerShowcaseImagesError = (val: string) => {
    setSellerShowcaseImagesError(val);
  };

  useEffect(() => {
    if (!gigDetail) return;
    const { images, video } = gigDetail;
    images?.forEach((item, index) => {
      sellerShowcaseImagesRefs.current[index].current?.setFileComingFromParent(
        item
      );
    });
    if (video) sellerShowcaseVideoRef.current?.setFileComingFromParent(video);

    let emptyImages = [];
    for (let i = 3 - (images?.length || 0); i > 0; i--) {
      emptyImages.push(null);
    }
    if (images) {
      setSellerShowcaseImages([...images, ...emptyImages]);
    } else {
      setSellerShowcaseImages(emptyImages);
    }
    if (video) setSellerShowcaseVideo(video);
  }, [gigDetail]);

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="gallery">
      <div className="gallery-wrapper pr-0">
        <h3>Showcase Your Services In A Gig Gallery</h3>
        <p className="heading-para">
          Encourage buyers to choose your Gig by featuring a variety of your
          work.
        </p>

        <div className="gallery-file-formats-wrapper">
          <section>
            <h4 className="gallery-heading">Images(up to 3)</h4>
            <p className="gallery-heading-para">
              Get noticed by the right buyers with visual examples of your
              services.
            </p>
            <div className="custom-file-input-wrapper">
              {[1, 2, 3].map((num, index) => {
                return (
                  <FileDropIcon
                    type="image"
                    fileAcceptType="image/*"
                    getSelectedFile={getSellerShowcaseImages}
                    index={index}
                    maxFileSize={5 * 1024 * 1024}
                    getError={getSellerShowcaseImagesError}
                    ref={sellerShowcaseImagesRefs.current[index]}
                  />
                );
              })}
            </div>
            {sellerShowcaseImagesError && (
              <p className="gallery-input-error">{sellerShowcaseImagesError}</p>
            )}
          </section>
          <section className="video">
            <h4 className="gallery-heading">Video (one only)</h4>
            <p className="gallery-heading-para">
              Capture buyers' attention with a video that showcases your
              service.
            </p>
            <p className="size-limit-warning">
              Please choose a video shorter than 75 seconds and smaller than
              50MB
            </p>
            <div className="custom-file-input-wrapper">
              <FileDropIcon
                fileAcceptType="video/*"
                type="video"
                getSelectedFile={getSellerShowcaseVideo}
                maxFileSize={50 * 1024 * 1024}
                getError={getSellerShowcaseVideoError}
                maxDuration={75}
                ref={sellerShowcaseVideoRef}
              />
            </div>
            {sellerShowcaseVideoError && (
              <p className="gallery-input-error">{sellerShowcaseVideoError}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Step5);
