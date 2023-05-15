import { Callout, Flex, Icon, PageHeader, Text } from "gestalt";

import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Box, Table } from "gestalt";
import { sdk } from "../../graphql/graphqlWrapper.server";
import { getSubdomain, isPrivateRoute } from "../../utils/utils.server";
import type { DashboardLists } from "./types";

import { useMemo } from "react";
import type { GetStarredListsQuery } from "~/graphql/__generated__/graphql";

import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import type { RootData } from "../../root";
import { GenericCatchBoundary } from "../../route-containers/GenericCatchBoundry";
import { GenericErrorBoundary } from "../../route-containers/GenericErrorBoundry";
import { calculateLocalTime } from "../../utils/calculateLocalTime";
dayjs.extend(LocalizedFormat);
export {
  GenericCatchBoundary as CatchBoundary,
  GenericErrorBoundary as ErrorBoundary,
};

export const meta: MetaFunction = ({ parentsData }) => {
  const rootData = parentsData.root as RootData;

  return {
    title: `Starred Lists - Dashboard | ${rootData.store?.name}`,
    description: "Your metrics activity feed",
  };
};

export async function loader({ request }: LoaderArgs) {
  const isPrivate = await isPrivateRoute(request);
  if (isPrivate == false) {
    return redirect("/");
  }

  const subdomain = getSubdomain(request);

  if (!subdomain) return redirect("/");

  const response = await Promise.all([
    sdk.GetStarredLists(
      {
        subdomain,
      },
      { request }
    ),
  ]);

  const lists = response[0];

  return json<DashboardLists>({
    lists: lists.getStarredLists,
  });
}

export default function Subscribers() {
  const loaderData = useLoaderData<DashboardLists>();
  return (
    <>
      <Box paddingX={2}>
        <Flex justifyContent="start" alignItems="center" gap={2}>
          <Link to="..">
            <Text underline size="100">
              Home
            </Text>
          </Link>

          <Icon
            accessibilityLabel="arrow-right"
            size={10}
            icon="arrow-forward"
            color="dark"
          />
          <Box color="lightWash" rounding="pill" padding={1} paddingX={2}>
            <Text size="100">Starred Lists</Text>
          </Box>
        </Flex>
      </Box>
      <PageHeader
        borderStyle="none"
        title="Starred Lists"
        subtext="Below are your starred lists. To view all your lists or change
        the starred ones, go to "
        helperLink={{
          text: "Lists",
          href: "/subscriber-lists",
          accessibilityLabel: "lists",
        }}
      />

      <Flex justifyContent="center">
        <Box width="92.5%" paddingY={6}>
          {!loaderData.lists?.length || loaderData.lists.length === 0 ? (
            <Callout
              iconAccessibilityLabel=""
              message="This tab will show your most important lists. To add a list to the dashboard,
          go to the lists page and click on the star next to its name."
              type="warning"
              title="You haven't added any lists to the dashboard."
              primaryAction={{
                accessibilityLabel: "Lists",
                label: "Lists",
                href: "/subscriber-lists",
                target: "self",
              }}
            />
          ) : null}
          <Flex direction="column" gap={8}>
            <ListTable />
          </Flex>
        </Box>
      </Flex>
    </>
  );
}

const ListTable = () => {
  const loaderData = useLoaderData<DashboardLists>();

  const lists = useMemo(
    () =>
      loaderData.lists?.map((list) => (
        <ListRow
          //@ts-ignore
          list={list}
          key={list.id}
        />
      )),
    [loaderData.lists]
  );

  return (
    <Box>
      <Table accessibilityLabel="Sticky Column" stickyColumns={1}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Text weight="bold">List</Text>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Text weight="bold">Subscribers</Text>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Text weight="bold">Added Today</Text>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Text weight="bold">Added This Week</Text>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{lists}</Table.Body>
      </Table>
    </Box>
  );
};

const ListRow = ({
  list,
}: {
  list: NonNullable<GetStarredListsQuery["getStarredLists"]>[0];
}) => {
  return (
    <>
      <Table.Row key={list.id}>
        <Table.Cell>
          <Flex gap={2} direction="column">
            <Link
              to={`/subscriber-lists/${list.name}/${list.id}`}
              prefetch="intent"
            >
              <Text underline>{list.name}</Text>
            </Link>
            <Text size="100">
              Created on {calculateLocalTime(list.createdAt, "LLL")}
            </Text>
          </Flex>
        </Table.Cell>
        <Table.Cell>
          <Text>{list.members}</Text>
        </Table.Cell>
        <Table.Cell>
          <Text>{list.addedToday}</Text>
        </Table.Cell>
        <Table.Cell>
          <Text>{list.addedThisWeek}</Text>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
