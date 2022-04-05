import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getProfileByUsername } from "~/models/user.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  profile: Awaited<ReturnType<typeof getProfileByUsername>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.username, "username not found");

  const profile = await getProfileByUsername(params.username);
  if (!profile) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ profile });
};

export default function ProfileDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.profile?.username}</h3>
      <p className="py-6">Member since: {data.profile?.createdAt}</p>
      <hr className="my-4" />
      {data.profile?.posts.length === 0 ? (
        <p className="p-4">No posts yet</p>
      ) : (
        <ol>
          {data.profile?.posts.map((post) => {
            <li key={post.id}>
              {post.body}
              {post.createdAt}
            </li>;
          })}
        </ol>
      )}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Profile not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
