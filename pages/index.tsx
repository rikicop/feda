//import type { NextPage } from "next";
import Head from "next/head";
//import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

//Trying styled-components
/* import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  color: #c01a72;
`;
 */
interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = (url: any) => url !== router.asPath && setLoading(true);
    const handleComplete = (url: any) =>
      url === router.asPath && setTimeout(() => setLoading(false), 2200);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  //console.log(posts);
  return (
    <div className="max-w-7xl mx-auto overflow-hidden">
      <Head>
        <title>FEDA Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex justify-between items-center bg-blue-600 border-y border-black py-10 lg:py-10 px-10">
        <div className="px-0  space-y-5 md:px-10 lg:px-10">
          <h1 className="text-6xl max-w-xl font-serif">
            La{" "}
            <span className="underline decoration-black decoration-4">
              Escuela de Música
            </span>{" "}
            es un lugar para crear, sentir y conectarse
          </h1>
          <h2>
            Este es un espacio para compartir conocimientos referentes a la
            Escuela de Música de la Universidad del Zulia.
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-64 lg:h-64"
          src="https://pngimg.com/uploads/letter_m/letter_m_PNG60.png"
          alt=""
        />
      </div>
      {/* Posts */}
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={350} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="border rounded-lg group cursor-pointer overflow-hidden">
                <img
                  className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  src={urlFor(post.mainImage).url()!}
                  alt=""
                />
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p>
                      {post.description}  { post.author &&  (<><p>Por</p><p className="font-bold">{post.author.name}</p></>)}
                    </p>
                  </div>
                  { post.author &&  <img
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt=""
                  />}
                 
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
  _id,title,author ->{name,image}
,
description,
mainImage,
slug}`;
  const posts = await sanityClient.fetch(query);

  return { props: { posts } };
};
