const obj = [
  {
    id: '8Che_3fRd0ZzAZvkAAAE',
    senderName: 'Salih',
    senderId: '5dc464f7e3f7002e22da54ac',
    receiverName: 'Salih',
    receiverId: '5dc464f7e3f7002e22da54ac',
  },
  {
    id: '8Che_3fRd0ZzAZvkAAAE',
    senderName: 'Salih',
    senderId: '5dc464f7e3f7002e22da54ac',
    receiverName: 'test',
    receiverId: '5dc5edf78aeb2f1bc224db2b',
  },
];

const recId = '5dc5edf78aeb2f1bc224db2b';

const getReceiverSocket = () => {
  const get = obj.find(el => {
    return el.receiverId === recId;
  });
  return get.id;
};
const a = getReceiverSocket();

console.log(a);
