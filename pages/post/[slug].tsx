import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import Block from "../../styles/Block.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
interface Props {
  post: Post;
}

function Post({ post }: Props) {
  //console.log(post);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main className="px-3">
      <Header />
      <div className="lg:px-56">
        <img
        className="w-full h-full object-contain"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      </div>  
      <article className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-light text-gray-500 mb-2">
          {post.title}
        </h2>
        <div className="flex items-center space-x-2">
          {post.author?.image && (  <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />  )}
          {post.author && (
              <p className="font-extralight text-sm">
                Publicado por
              <span className="text-green-600"> {post.author?.name}</span> -
                Publicado el {""}
                {new Date(post._createdAt).toLocaleDateString()}
             </p>
            )
          }
        
        </div>
        {post.body && (
           <div className={Block.body}>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PRJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold mb-2 mt-2">
                  {props.children}
                </h1>
              ),
              h2: (props: any) => (
                <h2 className="text-2xl font-bold mb-2 mt-2">
                  {props.children}
                </h2>
              ),
              h3: (props: any) => (
                <h3 className="text-xl font-bold mb-2 mt-2">
                  {props.children}
                </h3>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              image: ({ asset }: any) => (
                <img style={{ width: 300 }} src={urlFor(asset).url()!} alt="" />
              ),
            }}
          />
        </div>

        )}
       
      </article>
      <br />
      { post.video && (
         <div className="flex justify-center items-center h-[50vh] overflow-hidden relative pb-0">
        <iframe
          width="560"
          height="315"
          src={post.video}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
      )}
     
      <br />

      <hr className="max-w-lg my-5 mx-auto border border-blue-500" />
      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-blue-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">Gracias por tu comentario!!!</h3>
          <p>Una vez aprovado, aparecerá abajo!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-blue-500">Te gustó es artículo?</h3>
          <h4 className="text-3xl font-bold">Deja un comentario!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-cyan-500 outline-none focus:ring-1"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-cyan-500 outline-none focus:ring-1"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-cyan-500 outline-none focus:ring-1"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">El Campo Nombre es requerido</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                El Campo Comentario es requerido
              </span>
            )}
            {errors.email && (
              <span className="text-red-500">El Campo Email es requerido</span>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}
      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-blue-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="">
              <span className="text-blue-500">{comment.name}:</span>{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
      _id,
        slug {
            current
        }
  }`;
  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        video,
        'author': *[_type == "author" && post._ref == ^._id && approved == true][0]{name,image},
        'comments': *[_type == "comment" && 
         post._ref == ^._id &&
         approved == true],
        description,
        mainImage,
        slug,
        body
}`;
  const post = await sanityClient.fetch(query, { slug: params?.slug });
  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
