import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StepProps, StepRef } from "../../Pages/CreateGig";
import { IPackageDetails } from "../../types/order.types";
import { packagesData } from "./createGigData";
import PackageForm, { PackageFormRef } from "./PackageForm";

const Step2 = ({ handleSendData }: StepProps, ref: React.Ref<StepRef>) => {
  const packagesFormRefs = useRef<React.RefObject<PackageFormRef>[]>(
    packagesData.map(() => React.createRef())
  );

  const handleSubmit = async () => {
    console.log("running step 2");
    let warning = false;
    const packagesData: IPackageDetails[] = [];
    for (let i = 0; i < packagesFormRefs.current.length; i++) {
      const packageData =
        packagesFormRefs.current[i].current?.handlePackageSubmit();
      console.log(packageData);
      if (packageData) {
        packagesData.push(packageData);
      } else {
        warning = true;
      }
    }

    if (warning) return false;

    const payload = { data: packagesData, step: 2 };
    const res = await handleSendData(payload);
    return res || false;
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="mt-16 mx-[18%] mb-4 relative">
      <div className="p-8 pr-0">
        <h2 className="text-[1.75rem] mb-4 border-b border-b-no_focus pb-4">
          Scope & Pricing
        </h2>
        <h3 className="text-base font-semibold text-light_grey mb-3">
          Packages
        </h3>
        <div className="grid gap-4 grid-cols-3">
          {packagesData.map((pack, index) => {
            return (
              <PackageForm
                categoryId={index}
                ref={packagesFormRefs.current[index]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Step2);
