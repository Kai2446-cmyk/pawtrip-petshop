import Image from "next/image";
import React from "react";
import ServicesSlider from "./ServiceSlider";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Services = () => {
  return (
    <section
      id="service"
      className="bg-services bg-cover bg-no-repeat bg-center min-h-[862px]  items-center flex"
    >
      <div className="container mx-auto min-[862px]">
        <h2 className="h2 mb-12 flex flex-col">
          Pelayanan Kami
          <span className="text-xl flex gap-1 items-center opacity-60">
            Swipe <HiOutlineArrowNarrowRight />
          </span>
        </h2>
        <ServicesSlider />
      </div>
    </section>
  );
};

export default Services;
