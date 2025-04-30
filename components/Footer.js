import React from "react";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

const Footer = () => {
  return (
    <section className="flex flex-col bg:flex-row bg-footer bg-no-repeat bg-cover h-[250px]  items-center lg:items-start justify-center  p-16 gap-y-10 lg:gap-y-5">
      <div className="items-center flex text-orange">
        <a href="#" className="text-4xl font-semibold">
          Pet-First
        </a>
      </div>
      <ul className="text-lg flex items-center  text-white gap-x-5">
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a
            href="https://github.com/VedantBhawsar?tab=repositories"
            target="_blank"
          >
            Project
          </a>
        </li>
        <li>
          <a href="#service">Service</a>
        </li>

        <li>
          <a href="#">Contact</a>
        </li>
      </ul>
      <div className="text-white flex items-center  gap-x-5">
        <a href="https://github.com/Kai2446-cmyk?tab=repositories" target="_blank">
          <FaGithub size={35} />
        </a>
        <a href="https://www.instagram.com/afkardhi_/" target="_blank">
          <FaInstagram size={35} />
        </a>
        <a href="mailto:vedantb.developer@gmail.com" target="_blank">
          <AiOutlineMail size={35} />
        </a>
      </div>
    </section>
  );
};

export default Footer;
