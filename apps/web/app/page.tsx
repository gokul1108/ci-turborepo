import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};
import prisma from '@repo/db/client';

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default async function Home() {
  const user = await prisma.user.findFirst();
  
  return (
    <div>
      {user ? (
        <p>Welcome back, {user.username}</p>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
}

