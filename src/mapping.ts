import { BigInt, Bytes, log } from '@graphprotocol/graph-ts'

// Events.
import {
  Kick as KickEvent,
  LogNote as LogNoteEvent
} from "../generated/Flipper/Flipper"

// Contracts.
import { Flipper as FlipperContract } from "../generated/Flipper/Flipper"

// Entities.
import { Bid as BidEntity } from "../generated/schema"

export function handleKick(event: KickEvent): void {
  let bidId = event.params.id

  // log.info('Creating Bid with id {}', [
  //   bidId.toString()
  // ])

  // Create a new Bid entity.
  let bidEntity = new BidEntity(bidId.toString())

  // Populate data from the event.
  bidEntity.bid = event.params.bid
  bidEntity.lot = event.params.lot
  bidEntity.usr = event.params.usr
  bidEntity.gal = event.params.gal
  bidEntity.tab = event.params.tab

  // Retrieve the contract.
  let contract = FlipperContract.bind(event.address)

  // Populate data from the contract.
  let bid = contract.bids(bidId)
  bidEntity.guy = bid.value2
  bidEntity.tic = bid.value3
  bidEntity.end = bid.value4
  bidEntity.ilk = contract.ilk().toString()

  // Metadata.
  bidEntity.state = 'TENDING'
  bidEntity.origLot = bidEntity.lot

  // log.info('  bid.guy: {}', [
  //   bidEntity.guy.toHexString()
  // ])

  bidEntity.save()
}

export function handleTend(event: LogNoteEvent): void {
  let bidIdBytes = event.params.arg1.reverse() as Bytes
  let bidId = BigInt.fromUnsignedBytes(bidIdBytes)

  // log.info('Tending Bid with id {}', [
  //   bidId.toString()
  // ])

  // Retrieve existing Bid entity.
  let bidEntity = BidEntity.load(bidId.toString())

  // Retrieve the contract.
  let contract = FlipperContract.bind(event.address)

  // Populate data from the contract.
  let bid = contract.bids(bidId)
  bidEntity.bid = bid.value0
  bidEntity.guy = bid.value2
  bidEntity.tic = bid.value3

  // log.info('  bid.guy: {}', [
  //   bidEntity.guy.toHexString()
  // ])

  bidEntity.save()
}

export function handleDent(event: LogNoteEvent): void {
  let bidIdBytes = event.params.arg1.reverse() as Bytes
  let bidId = BigInt.fromUnsignedBytes(bidIdBytes)

  // log.info('Denting Bid with id {}', [
  //   bidId.toString()
  // ])

  // Retrieve existing Bid entity.
  let bidEntity = BidEntity.load(bidId.toString())

  // Retrieve the contract.
  let contract = FlipperContract.bind(event.address)

  // Populate data from the contract.
  let bid = contract.bids(bidId)
  bidEntity.lot = bid.value1
  bidEntity.guy = bid.value2
  bidEntity.tic = bid.value3

  // Metadata.
  bidEntity.state = 'DENTING'

  // log.info('  bid.guy: {}', [
  //   bidEntity.guy.toHexString()
  // ])

  bidEntity.save()
}

export function handleDeal(event: LogNoteEvent): void {
  let bidIdBytes = event.params.arg1.reverse() as Bytes
  let bidId = BigInt.fromUnsignedBytes(bidIdBytes)

  log.info('Dealing Bid with id {}', [
    bidId.toString()
  ])

  // Retrieve existing Bid entity.
  let bidEntity = BidEntity.load(bidId.toString())

  // Metadata.
  bidEntity.state = 'DEALT'
  bidEntity.dealTxHash = event.transaction.hash

  bidEntity.save()
}
