"use client";

import { Button, Input } from "@/components/ChakraUI";
import React, { Dispatch, SetStateAction } from "react";
import * as UserApi from "@/api/user";

export const LoginPage = ({ setIsLoggedIn }: { setIsLoggedIn: Dispatch<SetStateAction<boolean>> }) => {
  const [openAiKey, setOpenAiKey] = React.useState("");

  async function login(key: string) {
    if (key.length === 0) {
      alert("Please enter your OpenAI API key first.");
      return;
    }

    const data = await UserApi.login(key);
    if (data) {
      setIsLoggedIn(true);
    } else {
      alert("Login failed. Please check your API key.");
      setIsLoggedIn(false);
    }
  }

  return (
    <div className='flex flex-col justify-center h-[85vh] md:w-1/2 p-4'>
      <h1 className='text-white text-[34px] font-bold'>ChatGPT</h1>
      <p className='text-white text-xl'>你需要填写你自己的GPT分发的key.</p>
      <div className='text-white mt-5'>
        <div>
          1. 登录到 &nbsp;
          <a href='https://platform.openai.com/signup' target='_blank' className='underline'>
            OpenAI Platform.
          </a>
        </div>
        <div>
          2. 通过 &nbsp;
          <a href='https://platform.openai.com/account/api-keys' target='_blank' className='underline'>
            Settings → API keys.
          </a>
          创建一个自己key
        </div>
        <div>3. 复制你的key并黏贴到此处:</div>
      </div>
      <div className='my-4 flex gap-2 items-center flex-col md:flex-row'>
        <Input
          className='bg-white text-white'
          value={openAiKey}
          onChange={(ev) => setOpenAiKey(ev.target.value)}
        ></Input>
        <Button
          className='bg-white w-full md:w-auto'
          onClick={async () => {
            await login(openAiKey);
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};
