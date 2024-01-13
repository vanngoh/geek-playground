
class LinkedList:
  def __init__(self, list=None):
    if list is None:
      self.head = None
      self.size = 0
      return
    
    node = Node(data=list.pop(0))
    self.head = node
    self.size = 1
    for elem in list:
      node.next = Node(data=elem)
      node = node.next
      self.size += 1

  def __repr__(self):
    node = self.head
    nodes = []
    while node is not None:
      nodes.append(f"{node.data}")
      node = node.next
    nodes.append("None")
    return " -> ".join(nodes)
  
  def __iter__(self):
    node = self.head
    while node is not None:
      yield node
      node = node.next

  def push(self, data):
    node = Node(data=data)
    node.next = self.head
    self.head = node
    self.size += 1

  def append(self, data):
    node = Node(data=data)
    if self.head is None:
      self.head = node
      self.size += 1
      return
    
    last = self.head
    while (last.next):
      last = last.next
    last.next = node
    self.size += 1

  def insert_after(self, target_data, data):
    if self.head is None:
      raise Exception("List is empty.")
    
    for node in self:
      if str(node.data) == str(target_data):
        new_node = Node(data=data)
        new_node.next = node.next
        node.next = new_node
        self.size += 1
        return
    
    raise Exception("Target is not found.")
  
  def insert_before(self, target_data, data):
    if self.head is None:
      raise Exception("List is empty.")
    
    if str(self.head.data) == str(target_data):
      self.push(data=data)
      self.size += 1
      return
    
    prev_node = self.head
    for node in self:
      if str(node.data) == str(target_data):
        new_node = Node(data=data)
        prev_node.next = new_node
        new_node.next = node
        self.size += 1
        return
      prev_node = node

    raise Exception("Target is not found.")
  
  def pop(self):
    if self.head is None:
      raise Exception("List is empty.")
    
    curr_node = self.head
    while (curr_node.next and curr_node.next.next is not None):
      curr_node = curr_node.next
    curr_node.next = None
    self.size -= 1

  def remove(self, target_data):
    if self.head is None:
      raise Exception("List is empty.")
    
    if str(self.head.data) == str(target_data):
      self.head = self.head.next
      self.size -= 1
      return
    
    prev_node = self.head
    for node in self:
      if str(node.data) == str(target_data):
        prev_node.next = node.next
        self.size -= 1
        return
      prev_node = node

    raise Exception("Target is not found.")
  
  def reverse(self):
    if self.head is None:
      raise Exception("List is empty.")
    
    prev_node = None
    curr_node = self.head
    while (curr_node):
      next_node = curr_node.next
      curr_node.next = prev_node
      prev_node = curr_node
      curr_node = next_node

    self.head = prev_node
    
  def __len__(self):
    return self.size
    

class Node:
  def __init__(self, data):
    self.data = data
    self.next = None

  def __repr__(self):
    return f"{self.data}"