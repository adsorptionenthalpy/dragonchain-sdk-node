enum DragonchainResourceName {
    Transaction_L1_Search_Index = 'Transaction::L1::SearchIndex',  // What is indexed by ES
    Transaction_L1_Full = 'Transaction::L1::FullTransaction',  // A transaction containing header, payload and signature
    Transaction_L1_Queue_Task = 'Transaction::L1::QueueTask',  // A transaction to be enqueued to the transaction processor
    Transaction_L1_Bulk_Queue_Task = 'Transaction::L1::BulkQueueTask',  // A bulk transaction containing many valid transactions
    Transaction_L1_Stripped = 'Transaction::L1::Stripped',  // A transaction with header and signature, but no payload

    Block_L1_Search_Index = 'Block::L1::SearchIndex',  // What is indexed by ES
    Block_L2_Search_Index = 'Block::L2::SearchIndex',  // What is used to index blocks
    Block_L3_Search_Index = 'Block::L3::SearchIndex',  // What is used to index blocks
    Block_L4_Search_Index = 'Block::L4::SearchIndex',  // What is used to index blocks

    Block_L1_At_Rest = 'Block::L1::AtRest',  // Contains stringified Transaction::L1::Stripped array, what is stored in S3
    Block_L2_At_Rest = 'Block::L2::AtRest',  // What is stored in S3
    Block_L3_At_Rest = 'Block::L3::AtRest',  // What is stored in S3
    Block_L4_At_Rest = 'Block::L4::AtRest',  // What is stored in S3

    Broadcast_L1_InTransit = 'Broadcast::L1::InTransit',  // Contains stringified Transaction::L1::Stripped array, what is stored in S3
    Broadcast_L2_InTransit = 'Broadcast::L2::InTransit',
    Broadcast_L3_InTransit = 'Broadcast::L3::InTransit',
    Broadcast_L4_InTransit = 'Broadcast::L4::InTransit',

    Verification_Record_Desired_At_Rest = 'VerificationRecord::Desired::AtRest',  // What is stored as the base record in the Block Verification System Service to indicate a block needs verifications
    Verification_Record_Sent_At_Rest = 'VerificationRecord::Sent::AtRest',  // What is stored to indicate that a verification request has been sent
    Verification_Record_Receipt_At_Rest = 'VerificationRecord::Receipt::AtRest',  // What is stored to indicate that a verification receipt has been recieved

    SmartContract_L1_At_Rest = 'SmartContract::L1::AtRest',  // What is stored in S3
    SmartContract_L1_Search_Index = 'SmartContract::L1::SearchIndex',  // What is indexed by ES
    SmartContract_L1_Create = 'SmartContract::L1::Create',  // Smart contract create
    SmartContract_L1_Update = 'SmartContract::L1::Update'  // Smart contract update
}

export interface DragonchainTransaction {
  dcrn: DragonchainResourceName.Transaction_L1_Full,
  version: Number
  header: {
    txn_type: string,
    dc_id: string,
    txn_id: string,
    tag: string,
    timestamp: string,
    block_id: string,
    invoker: string
  }
  payload: string,
  proof: {
    full: string,
    stripped: string
  }
}

export interface DragonchainSearchResult {
  total: Number
  results: DragonchainTransaction[]
}

export interface DragonchainTransactionCreatePayload {
  version: string
  txn_type: string
  payload: object | string
  tag: string
}
