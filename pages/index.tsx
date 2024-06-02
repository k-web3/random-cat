import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
}

const IndexPage: NextPage<Props> = ({initialImageUrl}) => {
    // useStateで状態の定義
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);
    // useEffectは２つの引数を指定する　（第1引数：処理内容、第2引数：処理タイミング）
    // useEffect(() => {
    //     fetchImage()
    //         .then((newImage) => {
    //             setImageUrl(newImage.url); // 画像URLを更新
    //             setLoading(false); // ローディング状態を更新
    //         });
    // // 第2引数は　[]　空として、マウント時にのみ画像を読み込む
    // }, []);

    // ボタンをクリックして画像読み込み
    const handleClick = async () => {
        setLoading(true); // 読込中フラグを立てる
        const newImage = await fetchImage();
        setImageUrl(newImage.url); // 画像URLの更新
        setLoading(false); // 読込中フラグを倒す
    }
    // ローディング中でなければ画像を表示する
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>One more cat!</button>
            <div className={styles.frame}>
              {loading || <img className={styles.img} src={ imageUrl } />}
            </div>
        </div>
    )
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

// 猫画像URLの型定義
type Image = {
    url: string;
};
// 猫画像の取得
const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search")
    const images: unknown = await res.json();
    // 配列チェック
    if (!Array.isArray(images)) {
        throw new Error("猫の画像が取得できませんでした");
    }
    const image: unknown = images[0];
    // 型チェック
    if (!isImage(image)) {
        throw new Error("猫の画像が取得できませんでした"); 
    }
    return image;
};
// 型ガード関数
const isImage = (value: unknown): value is Image => {
    // オブジェクトチェック
    if (!value || typeof value !== "object") {
        return false;
    }
    // プロパティ存在チェック & 型チェック
    return "url" in value && typeof value.url === "string";
};
