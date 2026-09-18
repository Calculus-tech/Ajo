export type Member = {
  name: string;
  address: string;
  joinedAt: number;
  paidThisCycle: boolean;
  hasReceivedPayout: boolean;
};

export type Circle = {
  id: string;
  name: string;
  contributionAmount: string;
  frequency: string;
  adminAddress: string;
  members: Member[];
  cycleNumber: number;
};

const circles = new Map<string, Circle>();

export function createCircle(data: {
  name: string;
  contributionAmount: string;
  frequency: string;
  adminAddress: string;
}): Circle {
  const id = Math.random().toString(36).slice(2, 9);
  const circle: Circle = {
    id,
    name: data.name,
    contributionAmount: data.contributionAmount,
    frequency: data.frequency,
    adminAddress: data.adminAddress,
    members: [],
    cycleNumber: 1,
  };
  circles.set(id, circle);
  return circle;
}

export function getCircle(id: string): Circle | undefined {
  return circles.get(id);
}

export function joinCircle(
  id: string,
  name: string,
  address: string
): Circle | undefined {
  const circle = circles.get(id);
  if (!circle) return undefined;
  const exists = circle.members.some((m) => m.address === address);
  if (!exists && address !== circle.adminAddress) {
    circle.members.push({
      name,
      address,
      joinedAt: Date.now(),
      paidThisCycle: false,
      hasReceivedPayout: false,
    });
  }
  return circle;
}

export function markPaid(id: string, address: string): Circle | undefined {
  const circle = circles.get(id);
  if (!circle) return undefined;
  const member = circle.members.find((m) => m.address === address);
  if (member) member.paidThisCycle = true;
  return circle;
}

export function releasePayout(
  id: string,
  recipientAddress: string
): Circle | undefined {
  const circle = circles.get(id);
  if (!circle) return undefined;
  const recipient = circle.members.find((m) => m.address === recipientAddress);
  if (recipient) recipient.hasReceivedPayout = true;
  circle.members.forEach((m) => (m.paidThisCycle = false));
  circle.cycleNumber += 1;
  return circle;
}
